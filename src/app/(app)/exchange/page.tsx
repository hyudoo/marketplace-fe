"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "@/lib/axios";
import ExchangeView from "@/components/exchange/ExchangeView";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function ExchangeHome() {
  const session = useSession();
  const [exchanges, setExchanges] = useState([]);
  const [incomingExchanges, setIncomingExchanges] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const fetchExchanges = useCallback(async () => {
    if (!session?.data) {
      router.push("/");
    }
    const res = await axios.get("/user/exchange", {
      headers: {
        Authorization: `Bearer ${session?.data?.user?.accessToken}`,
      },
    });
    setExchanges(res?.data?.exchanges);
    setIncomingExchanges(res?.data?.incomingExchanges);

    const res1 = await axios.get("/user/getlistuser", {
      headers: {
        Authorization: `Bearer ${session?.data?.user?.accessToken}`,
      },
    });
    setUsers(res1?.data);
  }, [session, router]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

  return (
    <ExchangeView
      exchanges={exchanges}
      incomingExchanges={incomingExchanges}
      users={users}
    />
  );
}
