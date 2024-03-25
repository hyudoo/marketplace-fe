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
import SupplyChainContract from "@/contracts/SupplyChainContract";

const TransitHistoryModal = () => {
  const [history, setHistory] = React.useState<string[]>([]);
  // redux
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "transitHistory";
  const { onOpenChange } = useDisclosure();

  const { id, title } = data;

  const getTransitHistory = React.useCallback(async () => {
    const contract = new SupplyChainContract();
    const history = await contract.getTransitHistory(id as number);
    setHistory(history);
  }, [id]);

  React.useEffect(() => {
    getTransitHistory();
  }, [getTransitHistory]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large block border-b-2">
          <div className="text-center justify-center">TRANSIT HISTORY</div>
          <div className="text-center justify-center text-sm ">{title}</div>
        </ModalHeader>
        <ModalBody>
          {history.map((item, index) => (
            <div
              key={index}
              className="flex text-sm text-slate-500 justify-center items-center">
              {item}
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransitHistoryModal;
