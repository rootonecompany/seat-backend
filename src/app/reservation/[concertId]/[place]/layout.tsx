import "@/app/globals.css";
import SocketProvider from "@/providers/SocketProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seat Book",
  description: "Seat Book",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={inter.className}
      style={{
        padding: "5rem",
        display: "flex",
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SocketProvider>{children}</SocketProvider>
    </div>
  );
}
