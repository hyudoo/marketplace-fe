"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "@/lib/axios";
import AuctionPlace from "@/components/auction/AuctionPlace";

export default function Home() {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    const res = await axios.get("/auctions");
    setProducts(res?.data?.products);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return <AuctionPlace products={products} />;
}
