"use client";

import UserSetting from "@/components/profile/setting/UserSetting";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserProfile() {
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session?.data) {
      router.push("/");
    }
  });
  return <UserSetting user={session?.data?.user!} />;
}
