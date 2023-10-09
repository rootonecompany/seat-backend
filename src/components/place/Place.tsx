import React from "react";
import db from "@/libs/db";
import Link from "next/link";

interface PlaceProps {
  concertId: string;
}
const Place = async ({ concertId }: PlaceProps) => {
  const places = await db.seat.groupBy({
    by: ["place"],
    where: {
      concertId,
    },
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {places.map((seat) => (
        <Link key={seat.place} href={`/reservation/${concertId}/${seat.place}`}>
          <div
            style={{
              display: "flex",
              width: "1000px",
              height: "50px",
              color: "#000",
              alignItems: "center",
              justifyContent: "center",
              border: "3px solid #000",
            }}
          >
            {seat.place}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Place;
