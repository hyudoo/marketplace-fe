"use client";

import InventoryView from "@/components/profile/inventory/InventoryView";
import UserProfile from "@/components/profile/UserProfile";
import axios from "@/lib/axios";
import { useCallback, useEffect, useState } from "react";
import { Divider } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [listedProducts, setListedProducts] = useState([]);
  const [auctionProducts, setAuctionProducts] = useState([]);
  const session = useSession();
  const router = useRouter();

  const fetchInventory = useCallback(async () => {
    if (!session?.data) {
      router.push("/");
    }
    const res1 = await axios.get("/user/inventory", {
      headers: {
        Authorization: `Bearer ${session?.data?.user?.accessToken}`,
      },
    });
    setInventory(res1?.data?.products);

    const res2 = await axios.get("/user/listed", {
      headers: {
        Authorization: `Bearer ${session?.data?.user?.accessToken}`,
      },
    });
    setListedProducts(res2?.data?.products);

    const res3 = await axios.get("/user/auctionlisted", {
      headers: {
        Authorization: `Bearer ${session?.data?.user?.accessToken}`,
      },
    });
    setAuctionProducts(res3?.data?.products);
  }, [session, router]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return (
    <>
      <UserProfile user={session?.data?.user!} isCurrentUser={true} />
      <Divider className="my-4" />
      <InventoryView
        inventory={inventory}
        listedProducts={listedProducts}
        auctionProducts={auctionProducts}
      />
    </>
  );
}
