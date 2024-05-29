import { IUserInfo } from "@/_types_";
import axios from "@/lib/axios";
import React from "react";
import { CiLock } from "react-icons/ci";
import UserProfile from "@/components/profile/UserProfile";
import { Card, CardHeader, Divider } from "@nextui-org/react";
import getCurrentUser from "@/lib/hooks/getCurrentUser";
import InventoryTab from "@/components/profile/inventory/InventoryTab";
interface IParams {
  id: string;
}

export default async function Inventory({ params }: { params: IParams }) {
  const user = await getCurrentUser();
  const res = await axios.get(`/user/${params.id}`);
  const profile: IUserInfo = res?.data as IUserInfo;
  if (!profile?.isPublic) {
    return (
      <div className="gap-4">
        <UserProfile user={profile!} isCurrentUser={user?.id == profile?.id} />
        <Divider className="my-4" />
        <div className="flex justify-center text-2xl font-bold mt-2">
          This profile is private
          <CiLock />
        </div>
      </div>
    );
  }
  const res1 = await axios.get(`/inventory/${profile?.wallet}`);
  return (
    <>
      <UserProfile user={profile!} isCurrentUser={user?.id == profile?.id} />
      <Divider className="my-4" />
      <Card className="mx-3">
        <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
          Inventory
        </CardHeader>
        <InventoryTab products={res1?.data?.products} type="view" />
      </Card>
    </>
  );
}
