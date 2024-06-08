"use client";

import { IUserInfo } from "@/_types_";
import { formatDate, showSortAddress } from "@/utils";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import {
  Avatar,
  Button,
  Image,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";
interface IUserProfileProps {
  user: IUserInfo;
  isCurrentUser: boolean;
  isAdmin: boolean;
}

const UserProfile: React.FC<IUserProfileProps> = ({
  user,
  isCurrentUser,
  isAdmin,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="h-[300px] min-w-full bg-white relative">
        <Image
          src={user?.banner}
          width="100%"
          radius="none"
          className="min-w-full h-[300px] object-fill"
          alt="Banner"
        />

        <Avatar
          className="absolute w-36 h-36 md:w-48 md:h-48 border-2 left-4 z-10 -bottom-10 border-white drop-shadow-md text-large"
          src={user?.avatar}
        />
      </div>
      <div className="mt-12 p-5 flex justify-between">
        <div>
          <h2 className="text-4xl mb-2 font-bold">{user?.name || "Unnamed"}</h2>
          <div className="flex flex-1 space-x-2">
            <p className="flex">
              Wallet:
              <Tooltip content="Copy">
                <p
                  onClick={() => navigator.clipboard.writeText(user?.wallet!)}
                  className="pl-1 hover:border-b-2 border-cyan-400 hover:text-cyan-400 hover:cursor-pointer">
                  {showSortAddress(user?.wallet)}
                </p>
              </Tooltip>
            </p>
            <p className="">Joined {formatDate(user?.createdAt!)}</p>
          </div>
        </div>
        <div>
          {isCurrentUser && (
            <Dropdown placement="bottom">
              <DropdownTrigger>
                <Button variant="light">
                  <HiDotsHorizontal />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions" variant="flat">
                <DropdownItem
                  color="default"
                  endContent={<CiSettings />}
                  onClick={() => router.push("/account/setting")}>
                  Setting
                </DropdownItem>
                <DropdownItem
                  color="default"
                  hidden={isAdmin}
                  endContent={<CiSettings />}
                  onClick={() => router.push("/account/createProduct")}>
                  Create Product
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
