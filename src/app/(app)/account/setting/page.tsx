import UserSetting from "@/components/profile/setting/UserSetting";
import getCurrentUser from "@/lib/hooks/getCurrentUser";
import { redirect } from "next/navigation";

export default async function UserProfile() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/");
  }
  return <UserSetting user={user!} />;
}
