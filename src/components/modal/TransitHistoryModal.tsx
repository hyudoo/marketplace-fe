"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
  Divider,
} from "@nextui-org/react";
import React from "react";
import { IUserInfo } from "@/_types_";
import { useRouter } from "next/navigation";

interface ITransitHistoryModalProps {
  isOpen: boolean;
  history: IUserInfo[];
  title: string;
  onClose: () => void;
}

const TransitHistoryModal: React.FC<ITransitHistoryModalProps> = ({
  isOpen,
  history,
  title,
  onClose,
}) => {
  const router = useRouter();
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large block border-b-2">
          <div className="text-center justify-center">{title}</div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2 text-lg">
            <div className="text-xs md:text-sm grid grid-cols-3 items-center py-3">
              <div className="text-gray-600 font-semibold">Manufacturer:</div>
              <div
                className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/account/${history[0]?.id}`)}>
                <Avatar
                  className="mr-3"
                  size="sm"
                  isFocusable
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={history[0]?.avatar}
                />
                <div className="items-center hover:border-b-1 border-cyan-800">
                  {history[0]?.name || "Unnamed"}
                </div>
              </div>
            </div>
            <Divider />
            <div className="text-xs md:text-sm grid grid-cols-3 items-center py-3">
              <div className="text-gray-600 font-semibold">Author:</div>
              <div
                className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                onClick={() =>
                  router.push(`/account/${history[history.length - 1]?.id}`)
                }>
                <Avatar
                  className="mr-3"
                  size="sm"
                  isFocusable
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={history[history.length - 1]?.avatar}
                />
                <div className="items-center hover:border-b-1 border-cyan-800">
                  {history[history.length - 1]?.name || "Unnamed"}
                </div>
              </div>
            </div>
            <Divider />
          </div>
          <div className="text-xs md:text-sm text-gray-600 font-semibold">
            Transit History:
          </div>
          {history.map((item, index) => (
            <div
              key={index}
              className="text-xs md:text-sm grid grid-cols-3 items-center py-3">
              <div>{index + 1}</div>
              <div
                className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/account/${item.id}`)}>
                <Avatar
                  className="mr-3"
                  size="sm"
                  isFocusable
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={item?.avatar}
                />
                <div className="items-center hover:border-b-1 border-cyan-800">
                  {item?.name || "Unnamed"}
                </div>
              </div>
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransitHistoryModal;
