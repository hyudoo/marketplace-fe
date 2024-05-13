import { IUserInfo } from "@/_types_";
import { getSession } from "next-auth/react";

const getCurrentUser = async () => {
  try {
    const session = await getSession();
    const user: IUserInfo = {
      id: session?.user?.id!,
      name: session?.user?.name!,
      wallet: session?.user?.wallet!,
      avatar: session?.user?.avatar!,
      role: session?.user?.role!,
      status: session?.user?.status!,
      createdAt: session?.user?.createdAt!,
      isPublic: session?.user?.isPublic!,
    };
    return user;
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentUser;
