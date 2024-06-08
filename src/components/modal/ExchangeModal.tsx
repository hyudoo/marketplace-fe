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
import { IProductInfo, IUserInfo } from "@/_types_";
import { useModal } from "@/lib/use-modal-store";
import ExchangeProductContract from "@/contracts/ExchangeProductContract";
import ProductContract from "@/contracts/ProductContract";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import toast from "react-hot-toast";
interface IExchangeModalProps {
  isOpen: boolean;
  other?: IUserInfo;
  yourProducts?: IProductInfo[];
  otherProducts?: IProductInfo[];
  onClose: () => void;
}

const ExchangeModal: React.FC<IExchangeModalProps> = ({
  isOpen,
  other,
  yourProducts,
  otherProducts,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  // redux
  const { onOpen } = useModal();
  const { onOpenChange } = useDisclosure();
  const yourProductNames = yourProducts?.map((productName) => productName.name);
  const otherProductNames = otherProducts?.map(
    (productName) => productName.name
  );
  const yourProductIds = yourProducts?.map((product) => product.id);
  const otherProductIds = otherProducts?.map((product) => product.id);

  const router = useRouter();
  const session = useSession();
  const handleSubmit = async () => {
    if (!session?.data || !other || !yourProducts || !otherProducts) return;
    const signer = await getSigner(session?.data?.user?.wallet);
    try {
      setIsLoading(true);
      const productContract = new ProductContract(signer);
      const exchangeContract = new ExchangeProductContract(signer);
      for (let id of yourProductIds!) {
        await productContract.approve(exchangeContract._contractAddress, id);
      }
      const tx = await exchangeContract.createExchange(
        other?.wallet!,
        yourProductIds!,
        otherProductIds!
      );
      onOpen("success", { hash: tx, title: "EXCHANGE PRODUCT" });
      router.push("/exchange");
      router.refresh();
    } catch (error) {
      toast.error("Create Exchange Failed!!!");
    } finally {
      onClose();
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
            <div className="font-bold"> {yourProductNames?.toString()} </div>
            with
            <div className="font-bold"> {otherProductNames?.toString()} </div>
            from
            <div className="font-bold"> {other?.name} </div>
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
