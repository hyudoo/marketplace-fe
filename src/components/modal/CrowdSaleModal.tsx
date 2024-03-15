"use client";

import { IPackage, IRate } from "../../_types_";
import { useModal } from "@/reduxs/use-modal-store";
import InvestCard from "@/components/InvestCard";
import CrowdSaleContract from "../../contracts/CrowdSaleContract";
import MarketCoinsContract from "../../contracts/MarketCoinsContract";
import { useAppSelector, useAppDispatch } from "@/reduxs/hooks";
import { packages } from "../../constants";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
const CrowdSaleProviderModal = () => {
  const [pak, setPak] = React.useState<IPackage>();
  const [rate, setRate] = React.useState<IRate>({ bnbRate: 0 });
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const { wallet, signer } = useAppSelector((state) => state.account);
  const [txHash, setTxHash] = React.useState<string>();

  // redux
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "openCrowdSale";
  const { onOpen, onOpenChange } = useDisclosure();

  const getRate = React.useCallback(async () => {
    const crowdContract = new CrowdSaleContract();
    const bnbRate = await crowdContract.getBnbRate();
    setRate({ bnbRate });
  }, []);

  React.useEffect(() => {
    getRate();
  }, [getRate]);

  const handleBuyMKC = async (pk: IPackage) => {
    try {
      if (!signer) return;
      setPak(pk);
      setIsProcessing(true);
      let hash = "";
      const crowdContract = new CrowdSaleContract(signer);
      hash = await crowdContract.buyTokenByBNB(pk.amount);
      setTxHash(hash);
      // onOpen();
    } catch (error) {
      console.log("handleBuyMKC -> error", error);
    } finally {
      setPak(undefined);
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      size="5xl"
      onClose={onClose}
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}>
      <ModalContent>
        <ModalHeader className="flex gap-2 justify-center text-large m-2 border-b-[2px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          Crowd Sales
        </ModalHeader>
        <ModalBody>
          <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {packages.map((pk, index) => (
              <InvestCard
                pak={pk}
                key={index}
                isBuying={isProcessing && pak?.key === pk.key}
                rate={rate.bnbRate}
                walletInfo={wallet}
                onBuy={() => handleBuyMKC(pk)}
              />
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CrowdSaleProviderModal;
