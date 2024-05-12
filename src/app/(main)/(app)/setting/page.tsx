"use client";

import { IUserInfo } from "@/_types_";
import getCurrentUser from "@/lib/hooks/getCurrentUser";
import axios from "@/lib/axios";
import { useModal } from "@/reduxs/use-modal-store";
import { UploadButton } from "@/utils/uploadthing";
import { Avatar, Button, cn, Input, Switch } from "@nextui-org/react";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";

export default function UserProfile() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { onOpen } = useModal();
  const [yourProfile, setYourProfile] = React.useState<IUserInfo>();
  const session = useSession();
  const getUserInfo = React.useCallback(async () => {
    const user = await getCurrentUser();
    setYourProfile(user);
  }, []);

  React.useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const onSubmit = async () => {
    const res = await axios.patch(
      "/user/update",
      {
        name: yourProfile?.name,
        avatar: yourProfile?.avatar,
        isPublic: yourProfile?.isPublic ? true : false,
      },
      {
        headers: {
          Authorization: `Bearer ${session?.data?.user.accessToken}`,
        },
      }
    );
  };

  return (
    <div className="space-y-2">
      <Switch
        isSelected={yourProfile?.isPublic}
        onValueChange={(selected) =>
          setYourProfile({ ...yourProfile, isPublic: selected })
        }
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse min-w-full bg-content1 hover:bg-content2 items-center",
            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
            "data-[selected=true]:border-primary"
          ),
          wrapper: "p-0 h-4 overflow-visible",
          thumb: cn(
            "w-6 h-6 border-2 shadow-lg",
            "group-data-[hover=true]:border-primary",
            //selected
            "group-data-[selected=true]:ml-6",
            // pressed
            "group-data-[pressed=true]:w-7",
            "group-data-[selected]:group-data-[pressed]:ml-4"
          ),
        }}>
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold">Your profile</p>
          <p className="text-tiny text-default-400">
            Public your profile to other users
          </p>
        </div>
      </Switch>
      <div className="relative pb-4 mb-6 border-2 border-slate-300 rounded-2xl mt-2">
        {yourProfile?.avatar ? (
          <div className="flex justify-center min-h-32 md:min-h-40 items-center">
            <div className="relative w-28 md:w-36">
              <Avatar
                className="w-28 h-28 md:w-32 md:h-32"
                isBordered
                alt="NextUI Fruit Image with Zoom"
                src={yourProfile?.avatar}
              />
              <div
                className="z-10 hover:cursor-pointer absolute text-red-400  hover:text-red-600 top-0 right-1 h-4 w-4 md:h-6 md:w-6"
                onClick={() => setYourProfile({ ...yourProfile, avatar: "" })}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 min-h-24 md:min-h-36 flex text-slate-500 items-center justify-center">
            Upload your avatar
          </div>
        )}
        <UploadButton
          endpoint="avatarUploader"
          onClientUploadComplete={(res: any) => {
            setYourProfile({ ...yourProfile, avatar: res?.[0].url });
          }}
          onUploadError={(error: Error) => {
            toast.error("Upload image error!");
          }}
          appearance={{
            button: "text-blue-600 text-sm font-medium",
            container:
              "z-10 w-max flex-row rounded-lg border-cyan-300 bg-blue-200 px-1 border absolute transform -translate-x-1/2 inset-x-1/2 cursor-pointer hover:bg-blue-300 hover:border-cyan-400 hover:text-cyan-600 ",
            allowedContent: "hidden",
          }}
        />
      </div>

      <Input
        type="text"
        variant={"bordered"}
        label="Name"
        value={yourProfile?.name}
        isRequired
        placeholder="Enter your Name"
        onChange={(e) =>
          setYourProfile({ ...yourProfile, name: e.target.value })
        }
      />

      <Input
        type="email"
        variant={"bordered"}
        label="Email"
        value={yourProfile?.email}
        isRequired
        onChange={(e) =>
          setYourProfile({ ...yourProfile, email: e.target.value })
        }
      />

      <Input
        type="text"
        variant={"bordered"}
        label="Wallet"
        value={yourProfile?.wallet}
        isRequired
        onChange={(e) =>
          setYourProfile({ ...yourProfile, email: e.target.value })
        }
      />

      <Button
        fullWidth
        isLoading={isLoading}
        color="primary"
        variant="flat"
        type="submit"
        onClick={onSubmit}
        className="mb-4">
        Update
      </Button>
    </div>
  );
}
