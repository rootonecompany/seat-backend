import NextAuth from "next-auth/next";

// interface User {
//   created_at?: string;
//   updated_at?: string;
//   id?: string;
//   name?: string;
//   email?: string;
//   image?: string;
// }

declare module "next-auth" {
  interface User {
    created_at?: date;
    updated_at?: date;
  }
}

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken: string;
    accessTokenExpires: number;
    error: string;
  }
}
