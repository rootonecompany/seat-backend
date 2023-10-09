import Place from "@/components/place/Place";
import React, { useEffect, useState } from "react";

interface reservationPageProps {
  params: {
    concertId: string;
  };
}
const reservationPage = ({ params }: reservationPageProps) => {
  return <Place concertId={params.concertId} />;
};

export default reservationPage;
