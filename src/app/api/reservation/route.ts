import db from "@/libs/db";
import { NextResponse } from "next/server";

const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const concertId = searchParams.get("concertId") as string;
    const place = searchParams.get("place") as string;

    const seats = await db.seat.findMany({
      where: {
        concertId,
        place,
      },
    });

    return NextResponse.json({ items: seats });
  } catch (error) {
    console.log("[RESERVATION_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export { GET };
