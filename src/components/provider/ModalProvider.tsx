"use client";

import { useEffect, useState } from "react";
import CrowdSaleProviderModal from "../modal/CrowdSaleModal";
import ProcessingModal from "../modal/ProcessingModal";
import SuccessModal from "../modal/SuccessModal";

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
    </>
  );
};
