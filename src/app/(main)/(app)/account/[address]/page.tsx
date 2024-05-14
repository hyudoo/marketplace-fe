"use client";

import { IProfileInfo } from "@/_types_";
import InventoryView from "@/components/inventory/InventoryView";
import MiniProfile from "@/components/profile/MiniProfile";
import ProfileContract from "@/contracts/ProfileContract";
import { useAppSelector } from "@/reduxs/hooks";
import React from "react";

interface IParams {
  address: string;
}

export default function Inventory({ params }: { params: IParams }) {
  const [profile, setProfile] = React.useState<IProfileInfo>();
  const { signer } = useAppSelector((state) => state.account);

  const getProfile = React.useCallback(async () => {
    const profileContract = new ProfileContract(signer);
    const profile = await profileContract.getProfileByAddress(params?.address);
    setProfile(profile);
  }, [params?.address, signer]);

  React.useEffect(() => {
    getProfile();
  }, [getProfile]);

  if (!profile?.isPublic) {
    return (
      <div className="gap-4">
        <MiniProfile profile={profile!} canAdd={false} />
        <div className="flex justify-center text-2xl font-bold mt-2">
          This profile is private
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-8 h-8">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      <MiniProfile profile={profile!} canAdd={true} />
      <InventoryView address={params?.address} canCreate={false} type="view" />
    </>
  );
}
