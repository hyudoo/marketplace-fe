import React from "react";
import ProductView from "@/components/ProductView";

interface IParams {
  productId: number;
}

export default function App({ params }: { params: IParams }) {
  return (
    <div className="flex flex-wrap gap-4 w-full sm:w-5/6 mx-auto bg-white">
      <ProductView productId={params.productId} />
    </div>
  );
}
