import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/db";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1일
    updateAge: 2 * 24 * 60 * 60, // 2일
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        throw new Error("Invalid SNS login");
      }

      console.log("dbUser", dbUser);

      console.log("auth jwt token", token);
      console.log("auth jwt user", user);
      console.log("auth jwt account", account);
      console.log("auth jwt profile", profile);
      console.log("auth jwt trigger", trigger);
      console.log("auth jwt session", session);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    // user session이 조회될 때 마다 실행
    async session({ session, token, user }) {
      console.log("auth session session", session);
      console.log("auth session token", token);
      console.log("auth session user", user);
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return `${baseUrl}`;
      }
      console.log("redirect baseUrl", baseUrl);
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
