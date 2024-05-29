"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/reduxs/use-modal-store";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuctionContract from "@/contracts/AuctionContract";
import MarketCoinsContract from "@/contracts/MarketCoinsContract";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";

interface IJoinAuctionModal {
  isOpen: boolean;
  id: number;
  title: string;
  onClose: () => void;
}

const JoinAuctionModal: React.FC<IJoinAuctionModal> = ({
  isOpen,
  id,
  title,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { onOpen } = useModal();

  const { handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      price: 0,
    },
  });

  const { onOpenChange } = useDisclosure();
  const router = useRouter();
  const session = useSession();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.price <= 0 || !session?.data || !id) return;
    const signer = await getSigner(session?.data?.user?.wallet);
    try {
      setIsLoading(true);
      const marketCoins = new MarketCoinsContract(signer!);
      const auctionContract = new AuctionContract(signer);
      await marketCoins.approve(auctionContract._contractAddress, data.price);
      const tx = await auctionContract.joinAuction(id, data.price);
      await session.update({
        ...session?.data?.user,
        mkc: session?.data?.user?.mkc - data.price,
      });
      onOpen("success", { hash: tx, title: "JOIN AUCTION" });
      onClose();
      router.refresh();
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
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <ModalContent>
          <ModalHeader className="justify-center text-large m-2 border-b-2">
            JOIN AUCTION
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-x-1 text-sm items-center justify-center">
              You want to join auction{" "}
              <div className="font-bold"> {title} </div> at price
            </div>
            <Input
              type="number"
              variant={"bordered"}
              label="Price"
              isRequired
              placeholder="Enter your price"
              onChange={(e) => setValue("price", e.target.value)}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">MKC</span>
                </div>
              }
            />

            <Button
              fullWidth
              isLoading={isLoading}
              color="primary"
              variant="flat"
              type="submit"
              className="mb-4">
              Join
            </Button>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default JoinAuctionModal;
