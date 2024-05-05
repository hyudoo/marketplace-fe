"use client";

import React from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { IProductItem, IProfileInfo } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import { useAppSelector } from "@/reduxs/hooks";
import ExchangeModal from "@/components/modal/ExchangeModal";
import ExchangeItem from "@/components/exchange/ExchangeItem";
import ProfileContract from "@/contracts/ProfileContract";
import { useRouter } from "next/navigation";
import MiniProfile from "@/components/profile/MiniProfile";
import { toast } from "react-hot-toast";
interface IParams {
  address: string;
}

export default function Exchange({ params }: { params: IParams }) {
  const { wallet, signer } = useAppSelector((state) => state.account);
  const [otherInventory, setOtherInventory] = React.useState<IProductItem[]>();
  const [inventory, setInventory] = React.useState<IProductItem[]>();
  const [address, setAddress] = React.useState<string>("");
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const [senderProducts, setSenderProducts] = React.useState<number[]>([]);
  const [receiverProducts, setReceiverProducts] = React.useState<number[]>([]);
  const [senderProductsName, setSenderProductsName] = React.useState<string[]>(
    []
  );
  const [receiverProductsName, setReceiverProductsName] = React.useState<
    string[]
  >([]);
  const [profile, setProfile] = React.useState<IProfileInfo>();
  const router = useRouter();
  const getInventory = React.useCallback(async () => {
    if (!signer || !wallet?.address) return;
    if (wallet?.address === params?.address) {
      toast.error("Can't create exchange with yourself");
      router.push("/");
    }
    const profileContract = new ProfileContract(signer);
    const profile = await profileContract.getProfileByAddress(params?.address);
    setProfile(profile);
    if (!profile?.isPublic) {
      toast.error("Can't create new exchange with private profile");
      router.push("/");
    }
    const productContract = new SupplyChainContract(signer);
    const inventory = await productContract.getListProduct(
      wallet?.address as string
    );
    setInventory(inventory);
    const otherInventory = await productContract.getListProduct(
      params?.address
    );
    setOtherInventory(otherInventory);
  }, [wallet, signer, router, params?.address]);

  React.useEffect(() => {
    getInventory();
  }, [getInventory]);

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
        let arr = senderProductsName;
        arr.splice(id, 1);
        setSenderProductsName([...arr]);
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
        let arr = receiverProductsName;
        arr.splice(id, 1);
        setReceiverProductsName([...arr]);
      } else {
        receiverProducts.push(productId);
        setReceiverProducts([...receiverProducts]);
        receiverProductsName.push(productName);
        setReceiverProductsName([...receiverProductsName]);
      }
    }
  };

  return (
    <>
      <MiniProfile profile={profile!} canAdd={false} />
      <Card className="p-2">
        <div className="flex w-full flex-col">
          <div className="md:grid md:grid-cols-2 flex flex-col gap-2">
            <Card>
              <CardHeader className="items-center justify-center uppercase font-bold text-xl">
                Inventory
              </CardHeader>
              <CardBody>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                  {inventory?.map((product, index) => (
                    <ExchangeItem
                      onClick={() =>
                        handleClick("sender", product.id, product.name!)
                      }
                      key={index}
                      name={product.name}
                      image={product.images[0]}
                      isCheck={senderProducts.includes(product.id)}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
                Other Inventory
              </CardHeader>
              <CardBody>
                <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                  {otherInventory?.map((product, index) => (
                    <ExchangeItem
                      onClick={() =>
                        handleClick("receiver", product.id, product.name!)
                      }
                      key={index}
                      name={product.name}
                      image={product.images[0]}
                      isCheck={receiverProducts.includes(product.id)}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
          <Button
            color="primary"
            className="mt-2"
            onClick={() => setIsModalOpen(true)}>
            Exchange
          </Button>
        </div>
      </Card>
      <ExchangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        senderIds={senderProducts}
        receiverIds={receiverProducts}
        senderProductName={senderProductsName!}
        receiverProductName={receiverProductsName!}
        address={address}
      />
    </>
  );
}
