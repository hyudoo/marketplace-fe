import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/core";

export default async function getSession() {
  return await getServerSession(authOptions);
}
