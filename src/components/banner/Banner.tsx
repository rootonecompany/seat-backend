import React from "react";
import BannerItems from "./BannerItems";
import db from "@/libs/db";
import { format } from "date-fns";

const DATE_FORMAT = "yyyy MMM d, HH:mm";

const Banner = async () => {
  const concerts = await db.concert.findMany({});

  return (
    <div className="flex justify-center items-center">
      {concerts.map((concert) => (
        <BannerItems
          key={concert.id}
          id={concert.id}
          name={concert.name}
          description={concert.description}
          createdAt={format(new Date(concert.createdAt), DATE_FORMAT)}
        />
      ))}
    </div>
  );
};

export default Banner;
