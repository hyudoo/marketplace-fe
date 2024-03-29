import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import CardItem from "./CardItem";
import { IProductItem } from "@/_types_";
import SupplyChainContract from "@/contracts/SupplyChainContract";
import AcceptExchangeModal from "../modal/AcceptExchangeModal";
import CancelExchangeModal from "../modal/CancelExchangeModal";
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

  const getProduct = React.useCallback(async () => {
    try {
      const productContract = new SupplyChainContract();
      const yourProducts = await productContract.getProductInfoByIds(
        yourTokenIds!
      );
      setYourProduct(yourProducts);
      const otherProducts = await productContract.getProductInfoByIds(
        otherTokenIds!
      );
      setOtherProduct(otherProducts);
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    getProduct();
  }, [getProduct]);

  return (
    <>
      <div>
        <div className="flex items-center justify-center">
          Other Address: {address}
        </div>
        <div className="md:grid md:grid-cols-2 flex flex-col gap-s2">
          <Card>
            <CardHeader className="items-center justify-center uppercase font-bold text-xl gap-x-1">
              Your Item
            </CardHeader>
            <CardBody>
              <div className="gap-2 sm:grid sm:grid-cols-2">
                {yourProducts?.map((product, index) => (
                  <CardItem
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
              <div className="gap-2 sm:grid sm:grid-cols-2">
                {otherProducts?.map((product, index) => (
                  <CardItem
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
        <CardFooter>
          {type == "incoming-exchange" && (
            <Button onClick={() => setIsOpenAcceptModal(true)} color="primary">
              Accept
            </Button>
          )}

          {type == "exchange" && (
            <Button onClick={() => setIsOpenDeclineModal(true)} color="primary">
              Cancel
            </Button>
          )}
        </CardFooter>
      </div>
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
