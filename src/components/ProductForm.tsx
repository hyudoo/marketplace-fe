"use client";

import React from "react";

import { Input, Button, Image, Select, SelectItem } from "@nextui-org/react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const items = [];
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      price: 0,
      type: "",
      images: [
        "https://uploadthing.com/f/8d2312fd-6d91-406a-9de5-3404ae9433f5-23di.png",
      ],
    },
  });
  const images = watch("images");

  const [, scrollerRef] = useInfiniteScroll({
    isEnabled: isOpen,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
      <div className="md:grid md:grid-cols-2 mb-6 md:mb-2 gap-4 w-full">
        <Input
          variant={"bordered"}
          label="Name"
          isClearable
          isRequired
          placeholder="Enter your product name"
          onChange={(e) => setValue("name", e.target.value)}
        />
        <Input
          type="number"
          variant={"bordered"}
          label="Prices"
          isRequired
          onChange={(e) => setValue("price", e.target.value)}
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">MKC</span>
            </div>
          }
        />
        <Select
          items={items}
          label="Pick type Product"
          placeholder="Select a Product Type"
          scrollRef={scrollerRef}
          selectionMode="single"
          onChange={(e) => setValue("type", e.target.value)}
          onOpenChange={setIsOpen}>
          {(item: any) => (
            <SelectItem key={item.name} className="capitalize">
              {item.name}
            </SelectItem>
          )}
        </Select>
      </div>

      <UploadButton
        className="rounded-md border bg-slate-300 border-gray-300 p-2"
        endpoint="imageUploader"
        onClientUploadComplete={(res: any) => {
          console.log("res", res);
          // Do something with the response
          for (const file of res) {
            images.push(file.url);
          }
          setValue("images", images);
          console.log("images", images);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
        appearance={{
          button: "text-blue-600 text-sm font-medium",
          container:
            "w-max flex-row rounded-lg border-cyan-300 bg-blue-200 py-0",
          allowedContent: "hidden",
        }}
      />
      <div className="h-28 md:h-40 my-3">
        {images.length > 0 &&
          images.map((image: any, index: number) => (
            <div key={index} className="relative w-28 md:w-40">
              <Image alt="NextUI Fruit Image with Zoom" src={image} />
              <div
                onClick={() => setValue("images", images.toSpliced(index, 1))}
                className="z-10 hover:cursor-pointer absolute block rounded-full m-1 text-white ring-white bg-red-500 top-0 right-0 h-4 w-4 md:h-6 md:w-6 border-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 md:w-6 md:h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-center ">
        <Button className="w-full md:w-3 md:flex" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
}
