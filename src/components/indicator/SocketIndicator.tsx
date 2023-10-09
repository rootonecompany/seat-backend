"use client";
import React from "react";
import { useSocket } from "@/providers/SocketProvider";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row-reverse",
        }}
      >
        missing
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row-reverse",
      }}
    >
      isConnected
    </div>
  );
};

export default SocketIndicator;
