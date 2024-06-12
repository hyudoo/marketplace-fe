"use client";

import { IUserInfo } from "@/_types_";
import axios from "@/lib/axios";
import { UploadButton } from "@/utils/uploadthing";
import {
  Avatar,
  Button,
  cn,
  Image,
  Input,
  Switch,
  Tooltip,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import React from "react";
import toast from "react-hot-toast";
import { showSortAddress } from "@/utils";
import { GoCopy } from "react-icons/go";
import { FaXmark } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface IUserSettingProps {
  user: IUserInfo;
}

const UserSetting: React.FC<IUserSettingProps> = ({ user }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const session = useSession();
  const [yourProfile, setYourProfile] = React.useState<IUserInfo>(user);
  const router = useRouter();
  React.useEffect(() => {
    if (!session?.data) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.patch(
        "/user/update",
        {
          data: yourProfile,
        },
        {
          headers: {
            Authorization: `Bearer ${yourProfile?.accessToken}`,
          },
        }
      );

      await session.update({
        ...yourProfile,
      });
      toast.success("Update profile successfully");
    } catch (error) {
      toast.error("Somethings went wrongs");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-2 bg-white">
      <div className="text-2xl font-bold pt-5 pl-3">Profile Details</div>

      <Switch
        isSelected={yourProfile?.isPublic}
        onValueChange={(selected) =>
          setYourProfile({ ...yourProfile, isPublic: selected })
        }
        classNames={{
          base: cn(
            "inline-flex flex-row-reverse min-w-full bg-content1 hover:bg-content2 items-center",
            "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent"
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
          <p>Public your profile</p>
          <p className="text-tiny text-default-400">
            Public your profile to other users
          </p>
        </div>
      </Switch>

      <Input
        type="text"
        variant={"bordered"}
        label="Name"
        value={yourProfile?.name}
        isRequired
        placeholder="Enter Your Name"
        className="px-3"
        onChange={(e) =>
          setYourProfile({ ...yourProfile, name: e.target.value })
        }
      />
      <div className="px-5">Avatar:</div>
      <div className="relative mx-3 pb-4 mb-6 border-2 border-slate-300 rounded-2xl mt-2">
        {yourProfile?.avatar ? (
          <div className="flex justify-center min-h-32 lg:min-h-40 items-center">
            <div className="relative w-28 lg:w-36">
              <Avatar
                className="w-28 h-28 lg:w-32 lg:h-32"
                isBordered
                alt="NextUI Fruit Image with Zoom"
                src={yourProfile?.avatar}
              />
              <div
                className="z-10 hover:cursor-pointer absolute text-red-400  hover:text-red-600 top-0 right-1 h-4 w-4 lg:h-6 lg:w-6"
                onClick={() => setYourProfile({ ...yourProfile, avatar: "" })}>
                <FaXmark />
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-24 lg:min-h-36 flex text-slate-500 items-center justify-center">
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
      <div className="px-5">Banner:</div>
      <div className="relative mx-3 pb-4 mb-6 border-2 border-slate-300 rounded-2xl mt-2">
        {yourProfile?.banner ? (
          <div className="flex justify-center min-h-32 lg:min-h-40 items-center">
            <div className="relative h-28 lg:h-32">
              <Image
                className="h-28 w-80 lg:h-32 lg:w-96"
                alt="NextUI Fruit Image with Zoom"
                src={yourProfile?.banner}
              />
              <div
                className="z-10 hover:cursor-pointer absolute text-red-400  hover:text-red-600 top-0 right-1 h-4 w-4 lg:h-6 lg:w-6"
                onClick={() => setYourProfile({ ...yourProfile, banner: "" })}>
                <FaXmark />
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-24 lg:min-h-36 flex text-slate-500 items-center justify-center">
            Upload your Banner
          </div>
        )}
        <UploadButton
          endpoint="avatarUploader"
          onClientUploadComplete={(res: any) => {
            setYourProfile({ ...yourProfile, banner: res?.[0].url });
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
      <div className="space-x-2 p-3">
        <p className="font-bold pl-3">Wallet Address:</p>
        <Tooltip content="Copy">
          <Button
            variant="light"
            onClick={() => navigator.clipboard.writeText(yourProfile?.wallet!)}
            className="flex gap-2 hover:text-cyan-600">
            {showSortAddress(yourProfile?.wallet)}
            <GoCopy size={20} />
          </Button>
        </Tooltip>
      </div>

      <Button
        fullWidth
        isLoading={isLoading}
        color="primary"
        variant="flat"
        type="submit"
        onClick={onSubmit}
        className="mt-10 pd-10">
        Save
      </Button>
    </div>
  );
};

export default UserSetting;
