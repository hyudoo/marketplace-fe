import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import ExchangeItem from "./ExchangeItem";
import { IProductItem, IProfileInfo } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import AcceptExchangeModal from "../modal/AcceptExchangeModal";
import CancelExchangeModal from "../modal/CancelExchangeModal";
import ProfileContract from "@/contracts/ProfileContract";
import { useRouter } from "next/navigation";
interface IExchangeProps {
  exchangeId?: number;
  address?: string;
  yourTokenIds?: number[];
  otherTokenIds?: number[];
  type?: "exchange" | "incoming-exchange";
  render?: () => void;
}

export default function ExchangeCard({
  exchangeId,
  address,
  yourTokenIds,
  otherTokenIds,
  type,
  render,
}: IExchangeProps) {
  const [yourProducts, setYourProduct] = React.useState<IProductItem[]>([]);
  const [otherProducts, setOtherProduct] = React.useState<IProductItem[]>([]);
  const [isOpenAcceptModal, setIsOpenAcceptModal] =
    React.useState<boolean>(false);
  const [isOpenDeclineModal, setIsOpenDeclineModal] =
    React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<IProfileInfo>();
  const router = useRouter();
  const getExchangeInfo = React.useCallback(async () => {
    const productContract = new SupplyChainContract();
    const yourProducts = await productContract.getProductInfoByIds(
      yourTokenIds!
    );
    setYourProduct(yourProducts);
    const otherProducts = await productContract.getProductInfoByIds(
      otherTokenIds!
    );
    setOtherProduct(otherProducts);

    const profileContract = new ProfileContract();
    const profile = await profileContract.getProfileByAddress(address!);
    setProfile(profile);
  }, [yourTokenIds, otherTokenIds, address]);

  React.useEffect(() => {
    getExchangeInfo();
  }, [getExchangeInfo]);

  return (
    <>
      <Card className="px-2">
        <div className="flex items-center justify-center p-3">
          <div className="text-gray-600 font-semibold pr-4">Exchange with:</div>
          <div
            className="col-span-2 flex items-center text-gray-600/75 hover:text-cyan-600 hover:cursor-pointer"
            onClick={() => router.push(`/profile/${address}`)}>
            <Avatar
              className="mr-3"
              isFocusable
              size="sm"
              isBordered
              alt="NextUI Fruit Image with Zoom"
              src={profile?.avatar}
            />
            <div className="hover:border-b-1 items-center border-cyan-800">
              {profile?.name}
            </div>
          </div>
        </div>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-2">
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Your Item
            </CardHeader>
            <CardBody>
              <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {yourProducts?.map((product, index) => (
                  <ExchangeItem
                    key={index}
                    productId={product.id}
                    image={product?.images[0]}
                    name={product.name}
                  />
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Other Item
            </CardHeader>
            <CardBody>
              <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
                {otherProducts?.map((product, index) => (
                  <ExchangeItem
                    key={index}
                    productId={product.id}
                    image={product?.images[0]}
                    name={product.name}
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        <CardFooter className="justify-end gap-x-2">
          {type == "incoming-exchange" && (
            <Button onClick={() => setIsOpenAcceptModal(true)} color="primary">
              Accept
            </Button>
          )}

          <Button onClick={() => setIsOpenDeclineModal(true)} color="primary">
            Cancel
          </Button>
        </CardFooter>
      </Card>
      <AcceptExchangeModal
        isOpen={isOpenAcceptModal}
        id={exchangeId!}
        render={render!}
        onClose={() => setIsOpenAcceptModal(false)}
      />
      <CancelExchangeModal
        isOpen={isOpenDeclineModal}
        id={exchangeId!}
        render={render!}
        onClose={() => setIsOpenDeclineModal(false)}
      />
    </>
  );
}
