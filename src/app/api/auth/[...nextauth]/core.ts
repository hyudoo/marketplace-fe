import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        const { user, accessToken } = response;
        return {
          ...user,
          accessToken,
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
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};
