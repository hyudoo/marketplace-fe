"use client";

import { IProfileInfo, IUserInfo } from "@/_types_";
import ProfileContract from "@/contracts/ProfileContract";
import getCurrentUser from "@/lib/hooks/getCurrentUser";
import { setProfile, setUpdate } from "@/reduxs/accounts/account.slices";
import { useAppDispatch, useAppSelector } from "@/reduxs/hooks";
import { useModal } from "@/reduxs/use-modal-store";
import { formatDate, showSortAddress } from "@/utils";
import { UploadButton } from "@/utils/uploadthing";
import { HiDotsHorizontal } from "react-icons/hi";
import { CiSettings } from "react-icons/ci";
import {
  Avatar,
  Button,
  cn,
  Input,
  Switch,
  Image,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function UserProfile() {
  const [yourProfile, setYourProfile] = React.useState<IUserInfo>();
  const router = useRouter();

  const getUserInfo = React.useCallback(async () => {
    const user = await getCurrentUser();
    setYourProfile(user);
  }, []);

  React.useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <>
      <div className="w-full min-h-48 bg-slate-200 relative">
        <Image
          src={yourProfile?.banner || "/images/banner.jpg"}
          className="object-fill w-full h-48"
          alt="Banner"
        />

        <Avatar
          className="absolute w-36 h-36 border-2 left-4 -bottom-10 border-white drop-shadow-md  text-large"
          src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
        />
      </div>
      <div className="mt-12 p-5 flex justify-between">
        <div>
          <h2 className="text-4xl mb-2 font-bold">
            {yourProfile?.name || "Unnamed"}
          </h2>
          <div className="flex flex-1 space-x-2">
            <p className="flex">
              Wallet:
              <Tooltip content="Copy">
                <p
                  onClick={() =>
                    navigator.clipboard.writeText(yourProfile?.wallet!)
                  }
                  className="pl-1 hover:border-b-2 border-cyan-400 hover:text-cyan-400 hover:cursor-pointer">
                  {showSortAddress(yourProfile?.wallet)}
                </p>
              </Tooltip>
            </p>
            <p className="">Joined {formatDate(yourProfile?.createdAt!)}</p>
          </div>
        </div>
        <div>
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
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
