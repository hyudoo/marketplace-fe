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
    if (!id) return;
    try {
      const contract = new SupplyChainContract();
      const history = await contract.getTransitHistory(id);
      setHistory(history);
    } catch (error) {
      console.log(error);
    }
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
          <div className="text-center justify-center">{title}</div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2 text-lg">
            <div className="text-xs md:text-sm">
              <div className="text-gray-600 font-semibold">Manufacturer:</div>
              <div className="text-gray-600/75">{history[0]}</div>
            </div>
            <div className="text-xs md:text-sm">
              <div className="text-gray-600 font-semibold">Author:</div>
              <div className="text-sm text-gray-600/75">
                {history[history.length - 1]}
              </div>
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-600 font-semibold">
            Transit History:
          </div>
          {history.map((item, index) => (
            <div key={index} className="text-sm text-slate-500">
              {index + 1} - {item}
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransitHistoryModal;
