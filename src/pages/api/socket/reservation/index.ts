import db from "@/libs/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { number, session, status, id } = req.body;
    const { concertId, place } = req.query;

    if (!number) {
      return res.status(401).json({ error: "좌석번호가 없습니다." });
    }

    if (!session) {
      return res.status(401).json({ error: "회원정보가 없습니다." });
    }

    if (!status || status !== "authenticated") {
      return res.status(401).json({ error: "회원정보가 없습니다." });
    }

    if (!concertId) {
      return res.status(401).json({ error: "콘서트 정보가 없습니다." });
    }

    if (!id) {
      return res.status(401).json({ error: "좌석번호가 없습니다." });
    }

    if (!place) {
      return res
        .status(401)
        .json({ error: "좌석번호에 해당하는 열이 없습니다." });
    }

    const seat = await db.seat.update({
      where: {
        concertId: concertId as string,
        place: place as string,
        number: number as number,
        id: id as number,
      },
      data: {
        userId: session.user.email,
        isReserved: true,
      },
    });

    if (!seat) {
      return res.status(404).json({ error: "좌석번호를 찾을수 없습니다" });
    }

    const updateKey = `reservation:${concertId}:${place}:${number}:update`;

    res?.socket?.server?.io?.emit(updateKey, seat);

    return res.status(200).json(seat);
  } catch (error) {
    console.log("[RESERVATION ERROR]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export default handler;
