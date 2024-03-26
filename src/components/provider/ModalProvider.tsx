"use client";

import { useEffect, useState } from "react";
import CrowdSaleProviderModal from "../modal/CrowdSaleModal";
import ProcessingModal from "../modal/ProcessingModal";
import SuccessModal from "../modal/SuccessModal";
import ListProductModal from "../modal/ListProductModal";
import TransitHistoryModal from "../modal/TransitHistoryModal";
import UnlistProductModal from "../modal/UnlistProductModal";

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
      <ProcessingModal />
      <SuccessModal />
      <ListProductModal />
      <TransitHistoryModal />
      <UnlistProductModal />
    </>
  );
};
