"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const list = [
    {
      type: 1,
      title: "Orange",
      img: "/images/fruit-1.jpeg",
      price: "$5.50",
    },
    {
      type: 2,
      title: "Tangerine",
      img: "/images/fruit-2.jpeg",
      price: "$3.00",
    },
    {
      type: 3,
      title: "Raspberry",
      img: "/images/fruit-3.jpeg",
      price: "$10.00",
    },
    {
      type: 1,

      title: "Lemon",
      img: "/images/fruit-4.jpeg",
      price: "$5.30",
    },
    {
      type: 1,

      title: "Avocado",
      img: "/images/fruit-5.jpeg",
      price: "$15.70",
    },
    {
      type: 1,

      title: "Lemon 2",
      img: "/images/fruit-6.jpeg",
      price: "$8.00",
    },
    {
      type: 1,

      title: "Banana",
      img: "/images/fruit-7.jpeg",
      price: "$7.50",
    },
    {
      type: 1,

      title: "Watermelon",
      img: "/images/fruit-8.jpeg",
      price: "$12.20",
    },
  ];

  let tabs = [
    {
      id: "photos",
      label: "Photos",
      type: 1,
    },
    {
      id: "music",
      label: "Music",
      type: 2,
    },
    {
      id: "videos",
      label: "Videos",
      type: 3,
    },
  ];
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <Card>
              <CardBody>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                  {list.map(
                    (product, index) =>
                      item.type === product.type && (
                        <ProductCard
                          key={index}
                          name={product.title}
                          image={product.img}
                          price={product.price}
                        />
                      )
                  )}
                </div>
              </CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
