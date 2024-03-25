"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/constants";
import { IProduct, ProductItem } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";
import { useRouter } from "next/navigation";
import { useModal } from "@/reduxs/use-modal-store";

export default function Manage() {
  const router = useRouter();
  const { wallet, signer } = useAppSelector((state) => state.account);
  const { onOpen } = useModal();
  const [listproducts, setListProducts] = React.useState<ProductItem[]>();
  const getListProduct = React.useCallback(async () => {
    try {
      const productContract = new SupplyChainContract(signer);
      const listproducts = await productContract.getListProduct(
        wallet?.address as string
      );
      setListProducts(listproducts);
    } catch (err) {
      console.log(err);
    }
  }, [wallet]);

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
                onList={() =>
                  onOpen("listProduct", { id: product.id, title: product.name })
                }
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
