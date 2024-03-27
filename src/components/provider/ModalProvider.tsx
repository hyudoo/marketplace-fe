"use client";

import { useEffect, useState } from "react";
import CrowdSaleProviderModal from "../modal/CrowdSaleModal";
import SuccessModal from "../modal/SuccessModal";
import ListProductModal from "../modal/ListProductModal";
import TransitHistoryModal from "../modal/TransitHistoryModal";
import UnlistProductModal from "../modal/UnlistProductModal";
import TransferModal from "../modal/ExchangeModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CrowdSaleProviderModal />
      <SuccessModal />
      <ListProductModal />
      <TransitHistoryModal />
      <UnlistProductModal />
      <TransferModal />
    </>
  );
};
