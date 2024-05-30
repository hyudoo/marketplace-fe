import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar,
} from "@nextui-org/react";
import React from "react";

import { IUserInfo } from "@/_types_";
import { useRouter } from "next/navigation";

interface IListUserModalProps {
  users?: IUserInfo[];
  isOpen: boolean;
  onClose: () => void;
}

const ListUserModal: React.FC<IListUserModalProps> = ({
  users,
  isOpen,
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
        <ModalHeader className="justify-center text-large m-2 border-b-2">
          LIST USER
        </ModalHeader>
        <ModalBody>
          {users?.map((profile, index) => (
            <div className="flex justify-between" key={index}>
              <div
                className="col-span-2 flex items-center hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/account/${profile?.id}`)}>
                <Avatar
                  isFocusable
                  className="w-6 h-6 mr-3 text-tiny"
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={profile?.avatar}
                />
                <div className="hover:border-b-1 items-center border-cyan-800">
                  {profile?.name || "Unnamed"}
                </div>
              </div>
              <Button
                size="sm"
                radius="full"
                color="primary"
                onClick={() => router.push(`/exchange/${profile?.id}`)}>
                Create Exchange
              </Button>
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ListUserModal;
