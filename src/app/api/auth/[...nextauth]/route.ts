import bcrypt from "bcrypt";
import NextAuth, { Account, AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/db";
import axios, { AxiosError } from "axios";
import { JWT } from "next-auth/jwt";

// AccessToken이 만료되면 refreshToken을 사용해서 다시 받아오는 함수
async function refreshAccessToken(parameters: {
  token: JWT;
  user: User;
  account: Account | null;
}) {
  try {
    let url = "";
    if (parameters?.account?.provider === "google") {
      url =
        "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        });
    } else if (parameters?.account?.provider === "kakao") {
      // const url =
      //   "https://accounts.google.com/o/oauth2/v2/auth?" +
      //   new URLSearchParams({
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code",
      //   });
      url = "";
    }

    const params = {
      grant_type: "refresh_token",
      refresh_token: parameters.token.refreshToken,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const res = await axios.post(url, null, {
      headers,
      params,
      auth: {
        username: process.env.CLIENT_ID as string,
        password: process.env.CLIENT_SECRET as string,
      },
    });

    const refreshedTokens = await res.data;
    console.log("refreshedTokens", refreshedTokens);

    if (res.status !== 200) {
      throw refreshedTokens;
    }

    return {
      ...parameters.token,
      ...parameters.user,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires:
        Math.round(Date.now() / 1000) + refreshedTokens.expires_in,
      refreshToken:
        refreshedTokens.refresh_token ?? parameters.token.refreshToken,
    };
  } catch (err) {
    return {
      ...parameters.token,
      ...parameters.user,
      error: "RefreshAccessTokenError",
    };
  }
}

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
      authorization: { params: { access_type: "offline", prompt: "consent" } },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1일
    updateAge: 2 * 24 * 60 * 60, // 2일
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn callback", {
        user,
        account,
        profile,
        email,
        credentials,
      });
      if (user && account) {
        const dbUser = await prisma.account.findFirst({
          where: {
            userId: user.id,
            providerAccountId: account?.providerAccountId,
          },
        });
        console.log("dbUser", dbUser);

        if (dbUser?.refresh_token !== account.refresh_token) {
          await prisma.account.update({
            where: {
              id: dbUser?.id,
            },
            data: {
              refresh_token: account.refresh_token,
            },
          });
        }
        return true;
      }
      return false;
    },
    /**
     * JWT Callback
     * 웹 토큰이 실행 혹은 업데이트될때마다 콜백이 실행
     * 반환된 값은 암호화되어 쿠키에 저장됨
     */
    async jwt({ token, user, account, profile, session }) {
      console.log("jwt callback", { token, user, account, profile, session });
      //초기 로그인시 User 정보를 가공해 반환
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at,
          refreshToken: account.refresh_token,
          user,
        };
      }

      const nowTime = Math.round(Date.now() / 1000);
      const shouldRefreshTime =
        (token.accessTokenExpires as number) - 10 * 60 - nowTime;
      // 토큰이 만료되지 않았을때는 원래사용하던 토큰을 반환
      if (shouldRefreshTime > 0) {
        return {
          ...token,
          ...user,
        };
      }

      return refreshAccessToken({ token, user, account });
    },
    /**
     * Session Callback
     * ClientSide에서 NextAuth에 세션을 체크할때마다 실행
     * 반환된 값은 useSession을 통해 ClientSide에서 사용할 수 있음
     * JWT 토큰의 정보를 Session에 유지 시킨다.
     */
    async session({ session, token /* jwt() return */, user }) {
      console.log("session callback", { session, token, user });
      session.user = token.user as User;
      session.accessToken = token.accessToken as string;
      session.accessTokenExpires = token.accessTokenExpires as number;
      session.error = token.error as string;
      console.log("session return", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect callback", { url, baseUrl });
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
