"use client";
import React from "react";
import { Button, Image, image } from "@nextui-org/react";

export default function ProductView() {
  const images = [
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-2.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-3.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-4.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-5.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-6.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-6.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-6.jpeg",
    },
    {
      image:
        "https://app.requestly.io/delay/1000/https://nextui-docs-v2.vercel.app/images/fruit-6.jpeg",
    },
  ];
  const [mainImage, setMainImage] = React.useState<string>(images[0].image);
  const [index, setIndex] = React.useState(0);
  const [slideImage, setSlideImage] = React.useState(
    images.slice(index, index + 4)
  );

  const handleNextImage = () => {
    if (index + 4 < images.length) {
      setIndex(index + 1);
      setSlideImage(images.slice(index, index + 4));
    }
  };

  const handlePreviousImage = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSlideImage(images.slice(index, index + 4));
    }
  };

  return (
    <div className="md:grid md:grid-cols-3 space-x-2 p-2 w-full bg-white">
      <div>
        <Image
          width="100%"
          src={mainImage}
          fallbackSrc="https://via.placeholder.com/300x200"
          alt="NextUI Image with fallback"
        />
        <div className="relative py-2">
          <div className="absolute z-50 inset-y-2 left-0">
            <Button
              isIconOnly
              aria-label="previos"
              className="h-full"
              onClick={handlePreviousImage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {slideImage.map((img, index) => (
              <Image
                key={index}
                className="w-full h-full object-cover"
                src={img.image}
                alt="NextUI Image with fallback"
                onClick={() => setMainImage(img.image)}
              />
            ))}
          </div>
          <div className="absolute z-50 inset-y-2 right-0">
            <Button
              isIconOnly
              aria-label="next"
              className="h-full"
              onClick={handleNextImage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      <div className="col-span-2 pl-3">
        <div className="text-xl font-bold p-2">Product Information:</div>
        <div className="p-4 border-2 mx-4 space-y-4 border-blue-600 rounded-xl">
          <div className="text-3xl py-2 mb-2 font-bold border-blue-600 border-b-2">
            Sỉ 100 Cái Khẩu Trang Y Tế 5D Thịnh Phát
          </div>
          <div className="space-y-2 text-lg">
            <div className="justify-between flex">
              <div className="text-gray-600 font-semibold">Manufacturer:</div>
              <div className="text-sm text-gray-600/75">
                0xF8245050365E42C6FEc0c24539BA4E45675D8FE0
              </div>
            </div>
            <div className="justify-between flex">
              <div className="text-gray-600 font-semibold">Seller:</div>
              <div className="text-sm text-gray-600/75">
                0xF8245050365E42C6FEc0c24539BA4E45675D8FE0
              </div>
            </div>
            <div className="justify-between flex border-t-2 border-blue-600 pt-4">
              <p className="text-500">Price: {10} MKC</p>
              <Button variant="bordered" color="primary">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
        <div className="text-xl font-bold p-2">Product Description:</div>
        <div className="px-4 space-y-4">
          <div className="p-4 border-2 border-blue-600 rounded-xl">
            DESCRIPTION
          </div>
        </div>
      </div>
    </div>
  );
}
