import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { IUser } from "@/_types_";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        wallet: { label: "wallet", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.wallet) {
          throw new Error("Invalid credentials");
        }
        const response = await (
          await fetch(`${process.env.ENDPOINT_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.LOGIN_SECRET}`,
            },
            body: JSON.stringify({
              wallet: credentials.wallet,
            }),
          })
        ).json();

        if (response?.error) {
          throw new Error(response?.error);
        }
        const { user, accessToken, mkc } = response;
        return {
          ...user,
          accessToken,
          mkc,
        };
      },
    }),
  ],

  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token, user }) {
      session.user = token.user as IUser;
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = user;
      }
      if (trigger === "update" && session) {
        token = { ...token, user: session };
        return token;
      }
      return token;
    },
  },
};
