import { IUserInfo } from "@/_types_";
import axios from "@/lib/axios";
import getCurrentUser from "@/lib/hooks/getCurrentUser";
import UserProfile from "@/components/profile/UserProfile";
import { Divider } from "@nextui-org/react";
import { CiLock } from "react-icons/ci";
import CreateExchange from "@/components/exchange/CreateExchange";
import { redirect } from "next/navigation";

interface IParams {
  id: number;
}

export default async function Exchange({ params }: { params: IParams }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  const res = await axios.get(`/user/${params?.id}`, {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
  const profile: IUserInfo = res?.data as IUserInfo;
  if (!profile?.isPublic) {
    return (
      <div className="gap-4">
        <UserProfile user={profile!} isCurrentUser={user?.id == profile?.id} />
        <Divider className="my-4" />
        <div className="text-2xl font-bold mt-2">
          <div className="flex justify-center">
            This profile is private.
            <CiLock />
          </div>
          <div className="flex justify-center">
            You can&apos;t create exchange with private user
          </div>
        </div>
      </div>
    );
  }

  const res1 = await axios.get(`/inventory/${profile?.wallet}`);
  const res2 = await await axios.get("/user/inventory", {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
  return (
    <>
      <UserProfile user={profile!} isCurrentUser={false} />
      <Divider className="my-4" />

      <CreateExchange
        other={profile}
        otherProducts={res1?.data?.products}
        yourProducts={res2?.data?.products}
      />
    </>
  );
}
