"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import qs from "query-string";
import axios from "axios";

interface SeatItemsProps {
  concertId: string;
  place: string;
  number: number;
  id: number;
  isReserved: boolean;
}

const SeatItems = ({
  concertId,
  place,
  number,
  id,
  isReserved,
}: SeatItemsProps) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const onReservation = async (
    concertId: string,
    place: string,
    number: number,
    id: number
  ) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/socket/reservation",
        query: { concertId, place },
      });
      const res = await axios.patch(url, {
        number,
        session,
        status,
        id,
      });
      console.log("SeatItems response", res);
      router.refresh();
    } catch (error) {
      console.log("[SeatItems ERROR]", error);
    }
  };

  return (
    <div
      style={
        isReserved
          ? {
              display: "flex",
              width: "50px",
              height: "50px",
              color: "#000",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #000",
              cursor: "pointer",
              backgroundColor: "red",
            }
          : {
              display: "flex",
              width: "50px",
              height: "50px",
              color: "#000",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #000",
              cursor: "pointer",
            }
      }
      onClick={() => {
        onReservation(concertId, place, number, id);
      }}
    >
      {number}
    </div>
  );
};

export default SeatItems;
