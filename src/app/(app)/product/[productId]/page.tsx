"use client";

import React, { useCallback, useEffect, useState } from "react";
import ProductView from "@/components/product/ProductView";
import axios from "@/lib/axios";
import { IProductInfo } from "@/_types_";

interface IParams {
  productId: number;
}

export default function App({ params }: { params: IParams }) {
  const [product, setProduct] = useState<IProductInfo>();
  const [transitHistory, setTransitHistory] = useState([]);

  const fetchProduct = useCallback(async () => {
    const res = await axios.get(`/product/${params?.productId}`);
    setProduct(res?.data?.product);
    const res1 = await axios.get(`/transitHistory/${params?.productId}`);
    setTransitHistory(res1?.data);
  }, [params]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <div className="flex flex-wrap gap-4 w-full sm:w-5/6 mx-auto bg-white">
      <ProductView product={product!} transitHistory={transitHistory} />
    </div>
  );
}
