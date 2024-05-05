"use client";

import { Avatar, Navbar, NavbarBrand } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Children } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <>
      <Navbar isBordered maxWidth="full">
        <NavbarBrand
          onClick={() => router.push("/")}
          className="hover:cursor-pointer">
          <Avatar src="/logo.png" size="sm" alt="Blocket" className="mr-2" />
          <p className="font-bold text-inherit">Blocket</p>
        </NavbarBrand>
      </Navbar>
      {children}
    </>
  );
}
