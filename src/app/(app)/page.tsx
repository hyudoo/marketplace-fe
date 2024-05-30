"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "@/lib/axios";
import MarketPlace from "@/components/market/MarketPlace";

export default function Home() {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    const res = await axios.get("/market");
    setProducts(res?.data?.products);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return <MarketPlace products={products} />;
}
