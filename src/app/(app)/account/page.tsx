import InventoryView from "@/components/profile/inventory/InventoryView";
import UserProfile from "@/components/profile/UserProfile";
import getCurrentUser from "@/lib/hooks/getCurrentUser";
import axios from "@/lib/axios";
import React from "react";
import { Divider } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default async function App() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  const res1 = await axios.get("/user/inventory", {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
  const res2 = await axios.get("/user/listed", {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });

  const res3 = await axios.get("/user/auctionlisted", {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
  return (
    <>
      <UserProfile user={user!} isCurrentUser={true} isAdmin={user.role == 1} />
      <Divider className="my-4" />
      <InventoryView
        inventory={res1?.data?.products}
        listedProducts={res2?.data?.products}
        auctionProducts={res3?.data?.products}
      />
    </>
  );
}
