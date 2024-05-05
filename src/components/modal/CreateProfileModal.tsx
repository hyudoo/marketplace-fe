"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
  Avatar,
} from "@nextui-org/react";
import React from "react";
import { useModal } from "@/reduxs/use-modal-store";
import { useAppDispatch, useAppSelector } from "@/reduxs/hooks";
import { UploadButton } from "@/utils/uploadthing";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { setProfile, setUpdate } from "@/reduxs/accounts/account.slices";
import ProfileContract from "@/contracts/ProfileContract";
import toast from "react-hot-toast";

const CreateProfileModal = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [avatar, setAvatar] = React.useState<string>("");
  const { wallet, signer } = useAppSelector((state) => state.account);
  const { onOpen, type, isOpen } = useModal();
  const isModalOpen = isOpen && type === "openCreateProfile";
  const dispatch = useAppDispatch();
  const { handleSubmit, setValue } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  const { onOpenChange } = useDisclosure();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!signer || !wallet) return;
    try {
      setIsLoading(true);
      const profileContract = new ProfileContract(signer);
      const tx = await profileContract.createProfile(
        data.name,
        data.bio,
        avatar
      );

      onOpen("success", { hash: tx, title: "CREATE PROFILE SUCCESS" });
      dispatch(
        setProfile({
          name: data.name,
          bio: data.bio,
          avatar: avatar,
          isPublic: true,
        })
      );
      dispatch(setUpdate(true));
      setAvatar("");
    } catch (error) {
      console.log("handleListProduct -> error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      backdrop="blur"
      isOpen={isModalOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      placement="center"
      className="overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <ModalContent>
          <ModalHeader className="justify-center text-large m-2 border-b-2">
            CREATE PROFILE
          </ModalHeader>
          <ModalBody>
            <div className="relative pb-4 mb-6 border-2 border-slate-200 rounded-2xl">
              {avatar ? (
                <div className="flex justify-center min-h-24 md:min-h-36 items-center">
                  <div className="relative w-20 md:w-32">
                    <Avatar
                      className="w-20 h-20 md:w-32 md:h-32"
                      isBordered
                      alt="NextUI Fruit Image with Zoom"
                      src={avatar}
                    />
                    <div
                      className="z-10 hover:cursor-pointer absolute text-red-400  hover:text-red-600 top-0 right-1 h-4 w-4 md:h-6 md:w-6"
                      onClick={() => setAvatar("")}>
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
                  setAvatar(res?.[0].url);
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
              isRequired
              placeholder="Enter your name"
              onChange={(e) => setValue("name", e.target.value)}
            />

            <Input
              type="text"
              variant={"bordered"}
              label="Bio"
              isRequired
              placeholder="Enter your Bio"
              onChange={(e) => setValue("bio", e.target.value)}
            />

            <Button
              fullWidth
              isLoading={isLoading}
              color="primary"
              variant="flat"
              type="submit"
              className="mb-4">
              Create
            </Button>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateProfileModal;
