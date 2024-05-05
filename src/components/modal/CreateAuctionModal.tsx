"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  DatePicker,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/reduxs/use-modal-store";
import { useAppDispatch, useAppSelector } from "@/reduxs/hooks";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import AuctionContract from "@/contracts/AuctionContract";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { setUpdate } from "@/reduxs/accounts/account.slices";
import { useDateFormatter } from "@react-aria/i18n";

import { CalendarDate } from "@nextui-org/react";
interface ICreateAuctionModal {
  isOpen: boolean;
  id: number;
  title: string;
  render: () => void;
  onClose: () => void;
}

const CreateAuctionModal: React.FC<ICreateAuctionModal> = ({
  isOpen,
  id,
  title,
  render,
  onClose,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { wallet, signer } = useAppSelector((state) => state.account);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const { onOpen } = useModal();
  const dispatch = useAppDispatch();

  const { handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      price: 0,
    },
  });
  let formatter = useDateFormatter({ dateStyle: "full" });

  const { onOpenChange } = useDisclosure();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!signer || !wallet || !id || !render) return;
    if (data.price <= 0) {
      toast.error("Please enter a valid price!");
    }
    const start = new Date(startDate!);
    const end = new Date(endDate!);
    const now = new Date();
    if (start < now) {
      toast.error("Please select a valid start date.");
      return;
    }
    if (start >= end) {
      toast.error("Please select a valid end date.");
      return;
    }
    try {
      setIsLoading(true);
      const product = new SupplyChainContract(signer);
      const auctionContract = new AuctionContract(signer);
      await product.approve(auctionContract._contractAddress, id);
      const tx = await auctionContract.createAuction(
        id,
        data.price,
        Math.round(start.getTime() / 1000),
        Math.round(end.getTime() / 1000)
      );
      onOpen("success", { hash: tx, title: "CREATE AUCTION SUCCESS" });
      dispatch(setUpdate(true));
      render();
      onClose();
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
            CREATE AUCTION
          </ModalHeader>
          <ModalBody>
            <div className="flex gap-x-1 text-sm items-center justify-center">
              You want to sell <div className="font-bold"> {title} </div> at
              initial price
            </div>
            <Input
              type="number"
              variant={"bordered"}
              label="Price"
              isRequired
              placeholder="Enter your product initial price"
              onChange={(e) => setValue("price", e.target.value)}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">MKC</span>
                </div>
              }
            />
            <DatePicker
              label="Start Date"
              variant="bordered"
              onChange={(date) => {
                setStartDate(date);
              }}
              granularity="second"
              hourCycle={24}
              isRequired
            />
            <DatePicker
              label="End Date"
              variant="bordered"
              onChange={(date) => {
                setEndDate(date);
              }}
              hourCycle={24}
              granularity="second"
              isRequired
            />
            <Button
              fullWidth
              isLoading={isLoading}
              color="primary"
              variant="flat"
              type="submit"
              className="mb-4">
              Create
            </Button>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateAuctionModal;
