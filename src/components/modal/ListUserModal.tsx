"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Avatar,
} from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";
import ProfileContract from "@/contracts/ProfileContract";
import { IProfileInfo } from "@/_types_";
import { useAppSelector } from "@/reduxs/hooks";

interface IListUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ListUserModal: React.FC<IListUserModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [profiles, setProfiles] = React.useState<IProfileInfo[]>();
  const { wallet, signer } = useAppSelector((state) => state.account);
  // redux
  const { onOpenChange } = useDisclosure();
  const getUserList = React.useCallback(async () => {
    const profileContract = new ProfileContract();
    const profiles = await profileContract.getAllProfile(wallet?.address!);
    setProfiles(profiles);
    console.log("profiles", profiles);
  }, [wallet?.address]);

  React.useEffect(() => {
    getUserList();
  }, [getUserList]);

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
          LIST USER
        </ModalHeader>
        <ModalBody>
          {profiles?.map((profile, index) => (
            <div className="flex justify-between" key={index}>
              <div
                className="col-span-2 flex items-center hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/profile/${profile?.address}`)}>
                <Avatar
                  isFocusable
                  className="w-6 h-6 mr-3 text-tiny"
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={profile?.avatar}
                />
                <div className="hover:border-b-1 items-center border-cyan-800">
                  {profile?.name}
                </div>
              </div>
              <Button
                size="sm"
                radius="full"
                color="primary"
                onClick={() => router.push(`/exchange/${profile?.address}`)}>
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
