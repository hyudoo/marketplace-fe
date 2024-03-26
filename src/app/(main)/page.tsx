"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/constants";
import { IProduct, ProductItem } from "@/_types_";
import MarketContract from "@/contracts/MarketPlaceContract";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [listproducts, setListProducts] = React.useState<ProductItem[]>();
  const getListProduct = React.useCallback(async () => {
    try {
      const productContract = new SupplyChainContract();
      const marketContract = new MarketContract();
      const ids = await marketContract.getProductListedOnMarketPlace();
      console.log("ids", ids);
      const listproducts = await productContract.getProductsInfo(ids);
      setListProducts(listproducts);
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    getListProduct();
  }, [getListProduct]);

  return (
    <div className="flex w-full flex-col">
      <Card>
        <CardBody>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {listproducts?.map((product, index) => (
              <ProductCard
                key={index}
                name={product.name}
                image={product.images[0]}
                price={product.price}
                onClick={() => router.push(`/product/${product.id}`)}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
