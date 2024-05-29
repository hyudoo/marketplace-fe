import React from "react";
import ProductView from "@/components/product/ProductView";
import axios from "@/lib/axios";
import { IProductInfo } from "@/_types_";

interface IParams {
  productId: number;
}

export default async function App({ params }: { params: IParams }) {
  const res = await axios.get(`/product/${params?.productId}`);
  const res1 = await axios.get(`/transitHistory/${params?.productId}`);

  return (
    <div className="flex flex-wrap gap-4 w-full sm:w-5/6 mx-auto bg-white">
      <ProductView product={res?.data?.product} transitHistory={res1?.data} />
    </div>
  );
}
