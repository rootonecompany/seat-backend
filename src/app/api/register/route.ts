import bcrypt from "bcrypt";
import prisma from "@/libs/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("회원가입에 필요한 정보가 존재하지 않습니다.", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (findUser) {
      return NextResponse.json(
        {
          msg: `${email} 계정이 이미 존재합니다.\n${email} 계정으로 로그인 하시겠습니까?`,
          object: findUser,
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
      include: {
        accounts: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
};