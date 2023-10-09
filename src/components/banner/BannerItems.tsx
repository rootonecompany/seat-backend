import Link from "next/link";
import React from "react";

interface BannerItemsProps {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const BannerItems = async ({
  id,
  name,
  description,
  createdAt,
}: BannerItemsProps) => {
  // const router = useRouter();

  // const onReservation = (concertId: String) => {
  //   router.push(`/reservation/${concertId}`);
  // };

  return (
    <Link href={`/reservation/${id}`}>
      <div
        className="w-[100px] h-[200px] bg-gray-500 mt-10 text-lg text-slate-50
      flex flex-col justify-center items-center cursor-pointer gap-2"
      >
        <span>{name}</span>
        <span>{description}</span>
        <span>{createdAt}</span>
      </div>
    </Link>
  );
};

export default BannerItems;
