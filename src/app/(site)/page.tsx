import React from "react";
import Banner from "@/components/banner/Banner";
import Header from "@/components/header/Header";

const Home = () => {
  return (
    <div className="flex min-h-full flex-col py-12 sm:px-6 lg:px-8">
      <Header />
      <Banner />
    </div>
  );
};

export default Home;
