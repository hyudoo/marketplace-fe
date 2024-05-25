import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    /** The user's postal address. */
    user: {
      id: string;
      name: string;
      wallet: string;
      avatar: string;
      banner: string;
      role: number;
      status: number;
      isPublic: boolean;
      createdAt: Date;
      mkc: number;
      accessToken: string;
    };
  }
}
