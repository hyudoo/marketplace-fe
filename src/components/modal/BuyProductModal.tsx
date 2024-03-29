"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import React from "react";
import { useAppSelector } from "@/reduxs/hooks";
import MarketPlaceContract from "@/contracts/MarketPlaceContract";
import MarketCoinsContract from "@/contracts/MarketCoinsContract";
import { useModal } from "@/reduxs/use-modal-store";

interface IBuyProductModal {
  isOpen: boolean;
  title: string;
  productId: number;
  productPrice: number;
  onClose: () => void;
}

const BuyProductModal: React.FC<IBuyProductModal> = ({
  isOpen,
  title,
  productId,
  productPrice,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const { signer } = useAppSelector((state) => state.account);
  const { onOpen } = useModal();

  const handleSubmit = async () => {
    try {
      if (!signer || !productId || !productPrice) return;
      setIsLoading(true);
      const marketCoins = new MarketCoinsContract(signer);
      const marketContract = new MarketPlaceContract(signer);
      await marketCoins.approve(marketContract._contractAddress, productPrice);

      const tx = await marketContract.buyProduct(productId);
      onOpen("success", { hash: tx, title: "BUY PRODUCT" });
    } catch (err) {
      console.log("handleBuyProduct->error", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large m-2 border-b-2">
          BUY PRODUCT
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-x-1 text-sm items-center justify-center">
            You want to buy <div className="font-bold"> {title} </div>
          </div>

          <Button
            fullWidth
            isLoading={isLoading}
            onClick={handleSubmit}
            color="primary"
            variant="flat"
            type="submit"
            className="mb-4">
            Buy
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BuyProductModal;
