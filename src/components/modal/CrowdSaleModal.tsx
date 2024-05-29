"use client";

import { IPackage, IRate } from "../../_types_";
import { useModal } from "@/reduxs/use-modal-store";
import InvestCard from "@/components/InvestCard";
import CrowdSaleContract from "../../contracts/CrowdSaleContract";
import { packages } from "../../constants";
import { HiOutlineShoppingCart } from "react-icons/hi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
const CrowdSaleProviderModal = () => {
  const [pak, setPak] = React.useState<IPackage>();
  const [rate, setRate] = React.useState<IRate>({ bnbRate: 0 });
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);

  // redux
  const { isOpen, onClose, type, onOpen } = useModal();
  const isModalOpen = isOpen && type === "openCrowdSale";
  const { onOpenChange } = useDisclosure();
  const session = useSession();
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
      if (!session?.data) return;
      const signer = await getSigner(session?.data?.user?.wallet);
      setPak(pk);
      setIsProcessing(true);
      const crowdContract = new CrowdSaleContract(signer);
      const tx = await crowdContract.buyTokenByBNB(pk.amount);
      onOpen("success", { hash: tx, title: "BUY MARKET COINS" });
      await session.update({
        ...session?.data?.user,
        mkc: session?.data?.user?.mkc + pk.amount,
      });
    } catch (error) {
      console.log("handleBuyMKC -> error", error);
    } finally {
      setPak(undefined);
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      size="5xl"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex gap-2 justify-center text-large m-2 border-b-[2px]">
          <HiOutlineShoppingCart size={24} /> Crowd Sales
        </ModalHeader>
        <ModalBody>
          <div className="gap-2 grid grid-cols-2 md:grid-cols-4">
            {packages.map((pk, index) => (
              <InvestCard
                pak={pk}
                key={index}
                isBuying={isProcessing && pak?.key === pk.key}
                rate={rate.bnbRate}
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
