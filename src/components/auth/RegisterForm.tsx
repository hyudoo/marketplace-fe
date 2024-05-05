"use client";
declare var window: any;

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ethers } from "ethers";
const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState<string>();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const { handleSubmit, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      wallet: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (data.password.length < 8) {
      toast.error("Password is too short!");
      setIsLoading(false);
      return;
    }
    if (!/[a-z]/.test(data.password)) {
      toast.error("Password must contain at least one lowercase letter!");
      setIsLoading(false);
      return;
    }
    if (!/[A-Z]/.test(data.password)) {
      toast.error("Password must contain at least one uppercase letter!");
      setIsLoading(false);
      return;
    }

    if (!/\d/.test(data.password)) {
      toast.error("Password must contain at least one number!");
      setIsLoading(false);
      return;
    }

    if (!/[\W_]/.test(data.password)) {
      toast.error("Password must contain at least one special character!");
      setIsLoading(false);
      return;
    }

    await axios
      .post("/api/register", data)
      .then(() =>
        signIn("credentials", {
          ...data,
          redirect: false,
        })
      )
      .then((callback) => {
        if (callback?.error) {
          toast.error("Something went wrong!");
        }
        if (callback?.ok) {
          router.push("/");
        }
      })
      .catch(() => toast.error("Something went wrongs!"))
      .finally(() => setIsLoading(false));
  };

  const onConnectMetamask = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setValue("wallet", address);
      setWallet(address);
      console.log("address", address);
      // const bigBalance = await provider.getBalance(address);
      // const bnbBalance = Number.parseFloat(ethers.formatEther(bigBalance));
      // const marketCoins = new MarketCoinsContract(signer);
      // const mkcBigBalance = await marketCoins.getBalance(address);
      // const mkcBalance = Number.parseFloat(ethers.formatEther(mkcBigBalance));
      // const profileContract = new ProfileContract(signer);
      // const profile = await profileContract.getProfileByAddress(address);
      // if (profile.name === "") {
      //   onOpen("openCreateProfile");
      // } else {
      //   dispatch(setProfile(profile));
      // }

      // dispatch(setWalletInfo({ address, bnb: bnbBalance, mkc: mkcBalance }));
      // dispatch(setSigner(signer));
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            disabled={isLoading}
            required
            variant="bordered"
            onChange={(e) => setValue("name", e.target.value)}
            label="Username"
            type="text"
          />

          <Input
            disabled={isLoading}
            required
            variant="bordered"
            onChange={(e) => setValue("email", e.target.value)}
            label="Email"
            type="email"
          />

          <Input
            disabled
            required
            variant="bordered"
            value={wallet}
            endContent={
              <Button
                color="primary"
                variant="flat"
                onClick={onConnectMetamask}>
                Add Wallet
              </Button>
            }
            label="Wallet"
            type="text"
          />

          <Input
            disabled={isLoading}
            required
            variant="bordered"
            onChange={(e) => setValue("password", e.target.value)}
            label="Password"
            type="password"
          />

          <div>
            <Button
              disabled={isLoading}
              color="primary"
              variant="flat"
              fullWidth
              type="submit">
              Create an account
            </Button>
          </div>
        </form>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>Already have an account?</div>
          <div
            className="underline cursor-pointer"
            onClick={() => router.push("/auth/login")}>
            Sign in
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
