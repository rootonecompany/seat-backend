import bcrypt from "bcrypt";
import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("로그인에 필요한 정보가 존재하지 않습니다.", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.findUnique({
      where: {
        email,
        hashedPassword,
      },
      include: {
        accounts: true,
      },
    });

    console.log("user", user);

    return NextResponse.json(user);
  } catch (error) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
};
