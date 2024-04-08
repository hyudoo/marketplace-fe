"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/reduxs/use-modal-store";
import { useAppDispatch, useAppSelector } from "@/reduxs/hooks";
import ExchangeProductContract from "@/contracts/ExchangeProductContract";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useRouter } from "next/navigation";
import { setUpdate } from "@/reduxs/accounts/account.slices";

interface IExchangeModalProps {
  isOpen: boolean;
  address: string;
  senderIds?: number[];
  receiverIds?: number[];
  senderProductName?: string[];
  receiverProductName?: string[];
  onClose: () => void;
}

const ExchangeModal: React.FC<IExchangeModalProps> = ({
  isOpen,
  address,
  senderIds,
  receiverIds,
  senderProductName,
  receiverProductName,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  // redux
  const { onOpen } = useModal();
  const { wallet, signer } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  const { onOpenChange } = useDisclosure();

  const handleSubmit = async () => {
    if (!signer || !wallet || !address || (!senderIds && !receiverIds)) return;
    try {
      setIsLoading(true);
      const productContract = new SupplyChainContract(signer);
      const exchangeContract = new ExchangeProductContract(signer);
      for (let id of senderIds!) {
        await productContract.approve(exchangeContract._contractAddress, id);
      }
      const tx = await exchangeContract.createTransaction(
        address,
        senderIds!,
        receiverIds!
      );
      onOpen("success", { hash: tx, title: "EXCHANGE PRODUCT" });
      dispatch(setUpdate(true));
      router.push("/exchange");
    } catch (error) {
      console.log("handleListProduct -> error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large m-2 border-b-2">
          EXCHANGE PRODUCT
        </ModalHeader>
        <ModalBody>
          <div className="gap-x-1 text-sm items-center justify-center">
            You want to exchange
            <div className="font-bold"> {senderProductName?.toString()} </div>
            with
            <div className="font-bold"> {receiverProductName?.toString()} </div>
            from address
            <div className="font-bold"> {address} </div>
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Exchange
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ExchangeModal;
