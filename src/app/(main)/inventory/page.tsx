"use client";

import InventoryView from "@/components/inventory/InventoryView";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";
import { useRouter } from "next/navigation";
import React from "react";

export default function Inventory() {
  const { wallet, signer } = useAppSelector((state) => state.account);
  const [canCreate, setCanCreate] = React.useState<boolean>(false);
  const router = useRouter();
  const getInventory = React.useCallback(async () => {
    if (!signer || !wallet || !wallet.address) {
      router.push("/");
    }
    const productContract = new SupplyChainContract(signer);
    const canCreate = await productContract.hasMinterRole(wallet?.address!);
    setCanCreate(canCreate);
  }, [signer, wallet, router]);

  React.useEffect(() => {
    getInventory();
  }, [getInventory]);

  return <InventoryView address={wallet?.address!} canCreate={canCreate} />;
}
