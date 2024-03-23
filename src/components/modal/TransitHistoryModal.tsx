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
import { showTransactionHash } from "@/utils";

const TransitHistoryModal = () => {
  // redux
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "success";
  const { onOpenChange } = useDisclosure();

  const { hash, title } = data;
  const onNavigation = () => {
    if (window) {
      window.open(`https://testnet.bscscan.com/tx/${hash}`, "_blank");
    }
  };
  return (
    <Modal
      backdrop="blur"
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large m-2 border-b-2">
          {title}
        </ModalHeader>
        <ModalBody>
          <div className="flex text-sm text-slate-500 justify-center items-center">
            Your transaction is successful!
          </div>
          <Button
            fullWidth
            color="primary"
            variant="flat"
            className="mb-4"
            onClick={onNavigation}>
            {showTransactionHash(hash || "")}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransitHistoryModal;
