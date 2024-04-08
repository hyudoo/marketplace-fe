"use client";

import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tab,
  Tabs,
  Tooltip,
} from "@nextui-org/react";
import ProductCard from "@/components/product/ProductCard";
import { IProductItem } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";
import MarketContract from "@/contracts/MarketPlaceContract";
import { useRouter } from "next/navigation";
import AuctionContract from "@/contracts/AuctionContract";

export default function Inventory() {
  const [selected, setSelected] = React.useState("inventory");
  const { wallet, signer } = useAppSelector((state) => state.account);
  const router = useRouter();
  const [listedproducts, setListedProducts] = React.useState<IProductItem[]>();
  const [auctiondproducts, setAuctiondProducts] = React.useState<Array<any>>();
  const [inventory, setInventory] = React.useState<IProductItem[]>();
  const [isRender, setIsRender] = React.useState<boolean>(true);
  const [canCreate, setCanCreate] = React.useState<boolean>(false);

  const getListProduct = React.useCallback(async () => {
    if (!signer || !wallet || !wallet.address) {
      router.push("/");
    }
    if (!isRender) return;
    try {
      const productContract = new SupplyChainContract(signer);
      const canCreate = await productContract.hasMinterRole(wallet?.address!);
      setCanCreate(canCreate);
      const inventory = await productContract.getListProduct(wallet?.address!);
      setInventory(inventory);
      const marketContract = new MarketContract(signer);
      const ids = await marketContract.getMyProductListed(wallet?.address!);
      const listedProducts = await productContract.getProductsInfo(ids);
      setListedProducts(listedProducts);
      const auctionContract = new AuctionContract(signer);
      const auctionIds = await auctionContract.getMyProductListed(
        wallet?.address!
      );
      const auctionProducts = await productContract.getProductsInfo(auctionIds);
      setAuctiondProducts(auctionProducts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsRender(false);
    }
  }, [wallet, signer, isRender, router]);

  React.useEffect(() => {
    getListProduct();
  }, [getListProduct]);

  return (
    <div className="flex w-full flex-col">
      <Tabs
        aria-label="Options"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-cyan-600",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-cyan-600",
        }}>
        <Tab
          key="inventory"
          title={
            <div className="flex items-center space-x-2">
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
                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <span>Inventory</span>
              <Chip size="sm" variant="faded">
                {inventory?.length || 0}
              </Chip>
            </div>
          }>
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Inventory
              {canCreate && (
                <Tooltip
                  color="primary"
                  content={"Create new Product"}
                  className="capitalize">
                  <svg
                    onClick={() => router.push("/inventory/createProduct")}
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
                </Tooltip>
              )}
            </CardHeader>
            <CardBody>
              <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {inventory?.map((product, index) => (
                  <ProductCard
                    key={index}
                    productId={product.id}
                    name={product.name}
                    image={product.images[0]}
                    price={product.price}
                    render={() => setIsRender(true)}
                    type="inventory"
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
        <Tab
          key="listed"
          title={
            <div className="flex items-center space-x-2">
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
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <span>Listed</span>
              <Chip size="sm" variant="faded">
                {listedproducts?.length || 0}
              </Chip>
            </div>
          }>
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl">
              Your Listed Products
            </CardHeader>
            <CardBody>
              <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {listedproducts?.map((product, index) => (
                  <ProductCard
                    key={index}
                    name={product.name}
                    image={product.images[0]}
                    price={product.price}
                    productId={product.id}
                    type="unlist"
                    render={() => setIsRender(true)}
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="auctions"
          title={
            <div className="flex items-center space-x-2">
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
                  d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z"
                />
              </svg>

              <span>Auctions</span>
              <Chip size="sm" variant="faded">
                {auctiondproducts?.length || 0}
              </Chip>
            </div>
          }>
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl">
              Your Auctions Products
            </CardHeader>
            <CardBody>
              <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {auctiondproducts?.map((product, index) => (
                  <ProductCard
                    key={index}
                    name={product.name}
                    image={product.images[0]}
                    price={product.initialPrice}
                    isDone={product.endTime < Date.now()}
                    productId={product.id}
                    type="auction"
                    render={() => setIsRender(true)}
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
