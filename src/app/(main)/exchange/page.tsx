"use client";

import React from "react";
import { Card, CardBody, CardHeader, Input, Tooltip } from "@nextui-org/react";
import ProductCard from "@/components/product/ProductCard";
import { IProductItem } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";

export default function Transfer() {
  const { wallet, signer } = useAppSelector((state) => state.account);
  const [otherInventory, setOtherInventory] = React.useState<IProductItem[]>();
  const [inventory, setInventory] = React.useState<IProductItem[]>();
  const [isRender, setIsRender] = React.useState<boolean>(true);


  const getExchange = React.useCallback(async () => {
    if (!signer || !wallet?.address) return;
    try {
      const productContract = new SupplyChainContract(signer);
      const inventory = await productContract.getListProduct(
        wallet?.address as string
      );
      setInventory(inventory);
    } catch (err) {
      console.log(err);
    }
  }, [wallet, signer, address]);

  React.useEffect(() => {
    getExchange();
  }, [getExchange]);

  return (
   
  );
}
