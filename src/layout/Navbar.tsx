"use client";
declare var window: any;
import { numberFormat, showSortAddress, formatAccountBalance } from "@/utils";
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
} from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/reduxs/hooks";
import {
  setWalletInfo,
  setSigner,
  clearState,
  setUpdate,
} from "@/reduxs/accounts/account.slices";
import { ethers } from "ethers";
import MarketCoinsContract from "@/contracts/MarketCoinsContract";
import { useModal } from "@/reduxs/use-modal-store";
import { useRouter } from "next/navigation";

export default function NavigationLayout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { onOpen } = useModal();
  const { wallet, isUpdate } = useAppSelector((state) => state.account);

  const onConnectMetamask = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const bigBalance = await provider.getBalance(address);
      const bnbBalance = Number.parseFloat(ethers.formatEther(bigBalance));
      const marketCoins = new MarketCoinsContract(signer);
      const mkcBigBalance = await marketCoins.getBalance(address);
      const mkcBalance = Number.parseFloat(ethers.formatEther(mkcBigBalance));

      dispatch(setWalletInfo({ address, bnb: bnbBalance, mkc: mkcBalance }));
      dispatch(setSigner(signer));
    }
  };

  const updateWallet = React.useCallback(async () => {
    if (window.ethereum && isUpdate) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const bigBalance = await provider.getBalance(address);
      const bnbBalance = Number.parseFloat(ethers.formatEther(bigBalance));
      const marketCoins = new MarketCoinsContract(signer);
      const mkcBigBalance = await marketCoins.getBalance(address);
      const mkcBalance = Number.parseFloat(ethers.formatEther(mkcBigBalance));

      dispatch(setWalletInfo({ address, bnb: bnbBalance, mkc: mkcBalance }));
      dispatch(setUpdate(false));
    }
  }, [isUpdate, dispatch]);

  React.useEffect(() => {
    updateWallet();
  }, [updateWallet]);

  const disconnectMetamask = async () => {
    if (window.ethereum) {
      dispatch(clearState());
    }
  };
  return (
    <Navbar isBordered maxWidth="full">
      <NavbarBrand
        onClick={() => router.push("/")}
        className="hover:cursor-pointer">
        <Avatar src="/logo.png" size="sm" alt="Blocket" className="mr-2" />
        <p className="font-bold text-inherit">Blocket</p>
      </NavbarBrand>
      <NavbarContent as="div" className="items-center" justify="end">
        <Chip
          variant="flat"
          avatar={<Avatar src="/logo.png" />}
          onClick={() => onOpen("openCrowdSale")}
          endContent={
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          }>
          <p className="font-bold text-inherit text-tiny">
            {formatAccountBalance(wallet?.mkc || 0)} MKC
          </p>
        </Chip>
        <Chip variant="flat" avatar={<Avatar src="/bnb.png" />}>
          <p className="font-bold text-inherit text-tiny">
            {numberFormat(wallet?.bnb || 0)} BNB
          </p>
        </Chip>
        {wallet ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button color="primary" variant="flat">
                {showSortAddress(wallet?.address)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="profile"
                color="default"
                onClick={() => router.push("/inventory")}>
                Inventory
              </DropdownItem>
              <DropdownItem
                key="auctions"
                color="default"
                onClick={() => router.push("/auction")}>
                Auction
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
                endContent={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                onClick={disconnectMetamask}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button color="primary" variant="flat" onClick={onConnectMetamask}>
              Connect Wallet
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
