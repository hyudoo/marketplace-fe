"use client";

import { formatAccountBalance } from "@/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import {
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { HiOutlineLogout, HiOutlinePlusCircle } from "react-icons/hi";
import { getAddress } from "@/lib/hooks/getSigner";
import CrowdSaleModal from "@/components/modal/CrowdSaleModal";
export default function NavigationLayout() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: session } = useSession();

  const onConnectMetamask = async () => {
    const address = await getAddress();
    signIn("credentials", {
      wallet: address,
      redirect: false,
    }).then((callback: any) => {
      if (callback?.error) {
        toast.error(callback?.error);
      }

      if (callback?.ok && !callback?.error) {
        toast.success("Connect wallet successfully!");
        router.refresh();
      }
    });
  };
  return (
    <>
      <Navbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full">
        <NavbarContent className="flex gap-4" justify="start">
          <NavbarBrand
            onClick={() => router.push("/")}
            className="hover:cursor-pointer">
            <Avatar src="/logo.png" size="sm" alt="Blocket" className="mr-2" />
            <p className="font-bold text-inherit">Blocket</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="flex gap-4" justify="center">
          <NavbarItem>
            <Link
              className="font-bold text-black  hover:cursor-pointer"
              onClick={() => router.push("/")}>
              Marketplace
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              className="font-bold text-black hover:cursor-pointer"
              onClick={() => router.push("/auction")}>
              Auction
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          {session?.user && (
            <Chip
              variant="flat"
              avatar={<Avatar src="/logo.png" />}
              onClick={() => setIsOpen(true)}
              endContent={<HiOutlinePlusCircle />}>
              <p className="font-bold text-inherit text-tiny">
                {formatAccountBalance(session?.user?.mkc || 0) || 0} MKC
              </p>
            </Chip>
          )}
          {session?.user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={session?.user?.name as string}
                  size="sm"
                  src={session?.user?.avatar as string}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  color="default"
                  onClick={() => router.push("/account")}>
                  Profile
                </DropdownItem>
                <DropdownItem
                  key="exchange"
                  color="default"
                  onClick={() => router.push("/exchange")}>
                  Exchange
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  color="danger"
                  endContent={<HiOutlineLogout />}
                  onClick={() => signOut()}>
                  Sign out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NavbarItem>
              <Button
                color="primary"
                variant="flat"
                onClick={onConnectMetamask}>
                Connect wallet
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
      </Navbar>
      <CrowdSaleModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
