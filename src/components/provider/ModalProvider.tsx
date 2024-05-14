"use client";

import { useEffect, useState } from "react";
import CrowdSaleProviderModal from "../modal/CrowdSaleModal";
import SuccessModal from "../modal/SuccessModal";
import CreateProfileModal from "../modal/CreateProfileModal";

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
      <CreateProfileModal />
    </>
  );
};
