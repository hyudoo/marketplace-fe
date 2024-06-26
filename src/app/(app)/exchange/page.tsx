import getCurrentUser from "@/lib/hooks/getCurrentUser";
import axios from "@/lib/axios";
import ExchangeView from "@/components/exchange/ExchangeView";
import { redirect } from "next/navigation";
export default async function ExchangeHome() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  const res = await axios.get("/user/exchange", {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });

  const res1 = await axios.get("/user/getlistuser", {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
  return (
    <ExchangeView
      exchanges={res?.data?.exchanges}
      incomingExchanges={res?.data?.incomingExchanges}
      users={res1?.data}
    />
  );
}
