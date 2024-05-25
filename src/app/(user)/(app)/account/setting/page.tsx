import UserSetting from "@/components/profile/setting/UserSetting";
import getCurrentUser from "@/lib/hooks/getCurrentUser";

export default async function UserProfile() {
  const user = await getCurrentUser();
  return <UserSetting user={user!} />;
}
