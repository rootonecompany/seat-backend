import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/db";
import { AxiosError } from "axios";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
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
  // debug: process.env.NODE_ENV === "development",
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1일
    updateAge: 2 * 24 * 60 * 60, // 2일
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn user", user);
      console.log("signIn account", account);
      console.log("signIn profile", profile);
      console.log("signIn email", email);
      console.log("signIn credentials", credentials);
      try {
        if (account && user) {
          const dbUser = await prisma.user.findUnique({
            where: {
              email: user.email as string,
            },
            include: {
              accounts: true,
            },
          });
          console.log("dbUser", dbUser);
          return true;
        }
      } catch (error) {
        console.error(error);
        if (error instanceof AxiosError) {
          return `signin?errorcode=${error.message}`;
        }
      }
      return false;
    },
    async jwt({ token, user, account, profile }) {
      console.log("jwt token", token);
      console.log("jwt user", user);
      console.log("jwt account", account);
      console.log("jwt profile", profile);
      return token;
    },
    /**
     * token = jwt() return
     */
    async session({ session, token, user }) {
      console.log("session session", session);
      console.log("session token", token);
      console.log("session user", user);
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect url", url);
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
