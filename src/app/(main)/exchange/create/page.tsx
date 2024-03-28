"use client";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Tooltip,
} from "@nextui-org/react";
import ProductCard from "@/components/product/ProductCard";
import { IProductItem } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";
import { ethers } from "ethers";
import { useModal } from "@/reduxs/use-modal-store";

export default function Transfer() {
  const { wallet, signer } = useAppSelector((state) => state.account);
  const [otherInventory, setOtherInventory] = React.useState<IProductItem[]>();
  const [inventory, setInventory] = React.useState<IProductItem[]>();
  const [isRender, setIsRender] = React.useState<boolean>(true);
  const [address, setAddress] = React.useState<string>("");

  const [senderProducts, setSenderProducts] = React.useState<number[]>([]);
  const [receiverProducts, setReceiverProducts] = React.useState<number[]>([]);
  const [senderProductsName, setSenderProductsName] = React.useState<string[]>(
    []
  );
  const [receiverProductsName, setReceiverProductsName] = React.useState<
    string[]
  >([]);

  const { onOpen } = useModal();

  const getInventory = React.useCallback(async () => {
    if (!signer || !wallet?.address) return;
    try {
      const productContract = new SupplyChainContract(signer);
      const inventory = await productContract.getListProduct(
        wallet?.address as string
      );
      setInventory(inventory);
    } catch (err) {
      console.log(err);
    }
  }, [wallet, signer, address]);

  React.useEffect(() => {
    getInventory();
  }, [getInventory]);

  const getOtherInventory = React.useCallback(async () => {
    if (!address) return;
    try {
      const productContract = new SupplyChainContract();
      const otherInventory = await productContract.getListProduct(address);
      setOtherInventory(otherInventory);
    } catch (err) {
      console.log(err);
    }
  }, [address]);

  React.useEffect(() => {
    getOtherInventory();
  }, [getOtherInventory]);

  const isInvalidAddress = (address: string) => {
    try {
      ethers.getAddress(address);
    } catch (e) {
      return true;
    }
    return false;
  };

  const isInvalid = React.useMemo(() => {
    if (address === "") return false;
    return isInvalidAddress(address);
  }, [address]);

  const handleClick = async (
    type: string,
    productId: number,
    productName: string
  ) => {
    if (type === "sender") {
      const check = senderProducts.includes(productId);
      if (check) {
        const id = senderProducts.indexOf(productId);
        let newArr = senderProducts;
        newArr.splice(id, 1);
        setSenderProductsName(senderProductsName.splice(id, 1));
        setSenderProducts([...newArr]);
      } else {
        senderProducts.push(productId);
        setSenderProducts([...senderProducts]);
        senderProductsName.push(productName);
        setSenderProductsName([...senderProductsName]);
      }
    } else {
      const check = receiverProducts.includes(productId);
      if (check) {
        const id = receiverProducts.indexOf(productId);
        let newArr = receiverProducts;
        newArr.splice(id, 1);
        setReceiverProducts([...newArr]);
        setReceiverProductsName(receiverProductsName.splice(id, 1));
      } else {
        receiverProducts.push(productId);
        setReceiverProducts([...receiverProducts]);
        receiverProductsName.push(productName);
        setReceiverProductsName([...receiverProductsName]);
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-y-2">
      <Input
        type="text"
        label="Other Address"
        variant="bordered"
        isInvalid={isInvalid}
        onChange={(e) => setAddress(e.target.value)}
        color={isInvalid ? "danger" : "primary"}
        errorMessage={isInvalid && "Please enter a valid address"}
        placeholder="Enter Other Address"
      />
      <div className="md:grid md:grid-cols-2 flex flex-col">
        <Card>
          <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
            Other Inventory
          </CardHeader>
          <CardBody>
            <div className="gap-2 sm:grid sm:grid-cols-2">
              {otherInventory?.map((product, index) => (
                <ProductCard
                  onClick={() =>
                    handleClick("receiver", product.id, product.name!)
                  }
                  key={index}
                  productId={product.id}
                  name={product.name}
                  image={product.images[0]}
                  isCheck={receiverProducts.includes(product.id)}
                />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="items-center justify-center uppercase font-bold text-xl">
            Inventory
          </CardHeader>
          <CardBody>
            <div className="gap-2 sm:grid sm:grid-cols-2">
              {inventory?.map((product, index) => (
                <ProductCard
                  onClick={() =>
                    handleClick("sender", product.id, product.name!)
                  }
                  key={index}
                  name={product.name}
                  image={product.images[0]}
                  productId={product.id}
                  render={() => setIsRender(!isRender)}
                  isCheck={senderProducts.includes(product.id)}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
      <Button
        onClick={() =>
          onOpen("exchange", {
            senderIds: senderProducts,
            receiverIds: receiverProducts,
            senderProductName: senderProductsName,
            receiverProductName: receiverProductsName,
            address,
          })
        }>
        Exchange
      </Button>
    </div>
  );
}
