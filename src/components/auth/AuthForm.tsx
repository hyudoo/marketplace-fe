"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import AuthSocialButton from "./AuthSocialButton";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const { handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error(callback?.error);
        }

        if (callback?.ok) {
          toast.success("Login successfully!");
          router.push("/");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            disabled={isLoading}
            required
            onChange={(e) => setValue("email", e.target.value)}
            label="Email"
            type="email"
          />

          <Input
            disabled={isLoading}
            required
            onChange={(e) => setValue("password", e.target.value)}
            label="Mật khẩu"
            type="password"
          />

          <div>
            <Button
              disabled={isLoading}
              color="primary"
              variant="flat"
              fullWidth
              type="submit">
              Login
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
              absolute
              inset-0
              flex
              items-center
             ">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>{"Don't have an account?"}</div>
          <div
            className="underline cursor-pointer"
            onClick={() => router.push("/auth/register")}>
            Create an account
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
