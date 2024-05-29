import React from "react";
import axios from "@/lib/axios";
import MarketPlace from "@/components/market/MarketPlace";

export default async function Home() {
  const res = await axios.get("/market");
  return <MarketPlace products={res?.data?.products} />;
}
