"use client";

import React from "react";
import { Card, CardBody, CardHeader, Tooltip } from "@nextui-org/react";
import ProductCard from "@/components/product/ProductCard";
import { IProductItem } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";
import MarketContract from "@/contracts/MarketPlaceContract";
import { useRouter } from "next/navigation";

export default function Manage() {
  const { wallet, signer } = useAppSelector((state) => state.account);
  const router = useRouter();
  const [listedproducts, setListedProducts] = React.useState<IProductItem[]>();
  const [inventory, setInventory] = React.useState<IProductItem[]>();
  const [isRender, setIsRender] = React.useState<boolean>(true);
  const [canCreate, setCanCreate] = React.useState<boolean>(false);

  const getListProduct = React.useCallback(async () => {
    if (!isRender) return;

    if (!signer || !wallet || !wallet.address) {
      router.push("/");
    }
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
    <div className="flex w-full flex-col gap-y-2">
      <Card>
        <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
          Inventory
          {canCreate && (
            <Tooltip
              color="primary"
              content={"Create new Product"}
              className="capitalize">
              <svg
                onClick={() => router.push("/manage/createProduct")}
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
    </div>
  );
}
