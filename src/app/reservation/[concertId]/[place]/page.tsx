"use client";
import SeatItems from "@/components/seat/SeatItems";
import React from "react";
import qs from "query-string";
import SocketIndicator from "@/components/indicator/SocketIndicator";
import { useReservationQuery } from "@/hooks/useReservationQuery";
import useReservationSocket from "@/hooks/useReservationSocket";

interface PlacePageProps {
  params: {
    concertId: string;
    place: string;
  };
}

const PlacePage = ({ params }: PlacePageProps) => {
  const queryKey = `concert:${params.concertId}:${params.place}`;
  const fetchUrl = qs.stringifyUrl({
    url: `/api/reservation`,
    query: {
      concertId: params.concertId,
      place: params.place,
    },
  });
  const { data, status } = useReservationQuery({
    queryKey,
    apiUrl: fetchUrl,
  });
  useReservationSocket({ queryKey });

  console.log("reservation page useReservationQuery data", data);

  if (status === "loading") {
    return <div>loading...</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <SocketIndicator />
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        {data.items.map((seat: any, i: number) => (
          <SeatItems
            key={i}
            concertId={params.concertId}
            place={params.place}
            number={seat.number}
            id={seat.id}
            isReserved={seat.isReserved}
          />
        ))}
      </div>
    </div>
  );
};

export default PlacePage;
