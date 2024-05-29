import React from "react";
import axios from "@/lib/axios";
import AuctionPlace from "@/components/auction/AuctionPlace";

export default async function Home() {
  const res = await axios.get("/auctions");
  return <AuctionPlace products={res?.data?.products} />;
}
