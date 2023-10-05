"use client";
import clsx from "clsx";
import Image from "next/image";
import React from "react";

interface AuthSocialButtonProps {
  icon?: string;
  onClick: () => void;
}

const AuthSocialButton = ({ icon, onClick }: AuthSocialButtonProps) => {
  const imageSrc =
    icon === "kakao"
      ? "/images/login/btn_kakao.png"
      : "/images/login/btn_google.png";
  const height = icon === "google" ? 34 : 34;
  const width = icon === "google" ? 35 : 35;
  const social = icon === "google" ? "구글" : "카카오";
  return (
    <button
      className={clsx(
        `flex w-full justify-evenly items-center rounded-md bg-white px-4 py-2 text-gray-500
      shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-offset-0`,
        icon === "kakao" ? "bg-[#ffeb03]" : ""
      )}
      type="button"
      onClick={onClick}
    >
      <Image
        alt="Logo"
        height={height}
        width={width}
        className=""
        src={imageSrc}
      />
      <span className="">{social}로 로그인</span>
    </button>
  );
};

export default AuthSocialButton;
