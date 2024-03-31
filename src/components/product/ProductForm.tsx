"use client";

import React from "react";

import { Input, Button, Image, Select, SelectItem } from "@nextui-org/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { UploadButton } from "@/utils/uploadthing";
import { products } from "@/constants";
import axios from "axios";
import dynamic from "next/dynamic";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";
import { useModal } from "@/reduxs/use-modal-store";
import { useRouter } from "next/navigation";

const CustomEditor = dynamic(() => import("../custom-editor"), { ssr: false });

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { handleSubmit, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      name: "Sony A7S III",
      type: "Camera Camcorder",
      images: [
        "https://utfs.io/f/49aee093-6fab-49b8-b45a-56725c7b5971-1k.jpg",
        "https://utfs.io/f/819592ba-f9e7-4688-9b02-540b2b5be766-1c.jpg",
        "https://utfs.io/f/5ea95b64-62f0-4632-a9aa-01e14d81f1cb-1d.jpg",
        "https://utfs.io/f/579a181f-3067-4f8a-8f44-e460f20df83e-1e.jpg",
        "https://utfs.io/f/241804a6-6021-4b9d-bdbc-2c0122eb072c-1f.jpg",
        "https://utfs.io/f/1503c9b9-5a94-45b7-b461-34aee908bc85-1g.jpg",
        "https://utfs.io/f/6445f6c1-217f-4f3a-a947-ca62ffac585e-1h.jpg",
        "https://utfs.io/f/c4b39ba4-6768-49eb-ac58-4725888989ad-1i.jpg",
        "https://utfs.io/f/e13121d8-9f65-428b-9d1e-faca1cd69df7-1j.jpg",
      ],
      description: `<p>- Full frame CMOS BSI Exmor R 12.1MP sensor<br>- BIONZ XR image processing chip<br>- Record 4K UHD 120p, 4:2:2 10-bit video in the camera<br>- Export 16-bit Raw, HLG &amp; S-Log3 Gamma data<br>- Fast Hybrid AF 759 points<br>- EVF OLED QXGA 9.44 million dots<br>- 3.0" 1.44 million-dot multi-directional tilting touch screen<br>- 5-axis SteadyShot optical image stabilization, Active Mode for movie recording<br>- ISO extended 40-409600<br>- Continuous shooting at 10 fps<br>- Two CFexpress Type A or SD memory card trays</p>`,
    },
  });
  const { onOpen } = useModal();
  const router = useRouter();

  const images = watch("images");
  const { wallet, signer } = useAppSelector((state) => state.account);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.images.length == 0) {
      alert("Please upload at least one image");
      return;
    }

    if (data.description.length == 0) {
      alert("Please write a description");
      return;
    }

    try {
      setIsLoading(true);
      let res = await axios.post("/api/files", data);
      let { IpfsHash } = res.data;
      const contract = new SupplyChainContract(signer);
      const tx = await contract.addProduct({
        address: wallet?.address,
        cid: IpfsHash?.IpfsHash,
      });
      onOpen("success", { hash: tx, title: "ADD PRODUCT" });
      router.push("/manage");
    } catch (error) {
      console.log("handleSubmit -> error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <div className="text-2xl font-bold flex items-center justify-center py-3">
        ADD PRODUCT
      </div>
      <div className="md:grid md:grid-cols-2 mb-6 md:mb-2 space-y-4 md:space-y-0 gap-4 w-full">
        <Input
          variant={"bordered"}
          label="Name"
          isClearable
          isDisabled={isLoading}
          isRequired
          placeholder="Enter your product name"
          onChange={(e) => setValue("name", e.target.value)}
        />
        <Select
          isRequired
          isDisabled={isLoading}
          label="Pick type Product"
          placeholder="Select a Product Type"
          onChange={(e) => setValue("type", e.target.value)}>
          {products.map((product) => (
            <SelectItem
              key={product.value}
              value={product.value}
              data-focus-visible>
              {product.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="relative pb-4 border-2 border-slate-200 rounded-2xl">
        <div className="text-sm text-slate-600 p-2">Product Images</div>
        {images.length == 0 ? (
          <div className="p-2 min-h-40 flex text-slate-500 items-center justify-center">
            Upload your product images
          </div>
        ) : (
          <div className="p-2 min-h-40 place-items-center grid grid-cols-3 md:flex md:flex-wrap gap-1 md:justify-center items-center justify-start">
            {images.map((image: any, index: number) => (
              <div key={index} className="relative md:w-40">
                <Image alt="NextUI Fruit Image with Zoom" src={image} />
                <div
                  className="z-10 hover:cursor-pointer absolute text-red-400  hover:text-red-600 top-0 right-1 h-4 w-4 md:h-6 md:w-6"
                  onClick={() =>
                    setValue("images", images.toSpliced(index, 1))
                  }>
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
            ))}
          </div>
        )}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res: any) => {
            // Do something with the response
            for (const file of res) {
              images.push(file.url);
            }
            setValue("images", images);
          }}
          onUploadError={(error: Error) => {
            alert(`ERROR! ${error.message}`);
          }}
          appearance={{
            button: "text-blue-600 text-sm font-medium",
            container:
              "z-10 w-max flex-row rounded-lg border-cyan-300 bg-blue-200 px-1 border absolute transform -translate-x-1/2 inset-x-1/2 cursor-pointer hover:bg-blue-300 hover:border-cyan-400 hover:text-cyan-600 ",
            allowedContent: "hidden",
          }}
        />
      </div>
      <div className="pt-10 text-sm font-sm">Description:</div>
      <CustomEditor
        isRequired
        onChange={(e: any) => setValue("description", e)}
      />
      <div className="flex justify-center mt-3">
        <Button
          className="w-full md:w-3 md:flex"
          type="submit"
          isLoading={isLoading}>
          Submit
        </Button>
      </div>
    </form>
  );
}
