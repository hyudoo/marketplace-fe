"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@nextui-org/react";
import React from "react";
import MarketPlaceContract from "@/contracts/MarketPlaceContract";
import MarketCoinsContract from "@/contracts/MarketCoinsContract";
import { useModal } from "@/lib/use-modal-store";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const { onOpen } = useModal();
  const session = useSession();
  const router = useRouter();
  const handleSubmit = async () => {
    if (!session?.data || !productId || !productPrice) {
      return;
    }
    if (session?.data?.user?.mkc < productPrice) {
      toast.error("You don't have enough MKC. Please buy MKC to continue.");
      onOpen("openCrowdSale");
      return;
    }
    try {
      const signer = await getSigner(session?.data?.user?.wallet);
      setIsLoading(true);
      const marketCoins = new MarketCoinsContract(signer!);
      const marketContract = new MarketPlaceContract(signer!);
      await marketCoins.approve(marketContract._contractAddress, productPrice);
      const tx = await marketContract.buyProduct(productId);
      await session.update({
        ...session?.data?.user,
        mkc: session?.data?.user?.mkc - productPrice,
      });
      onOpen("success", { hash: tx, title: "BUY PRODUCT" });
      router.refresh();
    } catch (err) {
      toast.error("Buy Product Failed!!!");
    } finally {
      onClose();
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
            with price {productPrice} MKC?
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
