import bcrypt from "bcrypt";
import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    return NextResponse.json(null);
  } catch (error) {
    console.log(error, "OAUTH_ACCESS_TOKEN_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
};
