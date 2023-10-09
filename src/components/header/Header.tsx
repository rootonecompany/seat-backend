"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Header = () => {
  const { data: session, status, update } = useSession();
  const [image, setImage] = useState("");

  useEffect(() => {
    if (session?.user?.image) setImage(session?.user?.image);
  }, [session?.user?.image]);

  if (!session) {
    return (
      <div className="flex flex-row justify-end cursor-pointer">
        <span onClick={() => signIn()}>로그인</span>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-end">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex" }}>
          <Image src={image} width="48" height="48" alt="profile" />
        </div>
        <span className="cursor-pointer" onClick={() => signOut()}>
          로그아웃
        </span>
      </div>
    </div>
  );
};

export default Header;
