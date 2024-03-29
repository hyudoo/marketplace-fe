"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import ProductCard from "@/components/product/ProductCard";
import { IProductItem } from "@/_types_";
import MarketContract from "@/contracts/MarketPlaceContract";
import SupplyChainContract from "@/contracts/SupplyChainContract";
export default function Home() {
  const [listproducts, setListProducts] = React.useState<IProductItem[]>();
  const getListProduct = React.useCallback(async () => {
    try {
      const productContract = new SupplyChainContract();
      const marketContract = new MarketContract();
      const ids = await marketContract.getProductListedOnMarketPlace();
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
                productId={product.id}
                name={product.name}
                image={product.images[0]}
                price={product.price}
                type="listed"
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
