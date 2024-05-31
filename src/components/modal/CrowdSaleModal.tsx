import { IPackage, IRate } from "../../_types_";
import { useModal } from "@/lib/use-modal-store";
import InvestCard from "@/components/InvestCard";
import CrowdSaleContract from "../../contracts/CrowdSaleContract";
import { packages } from "../../constants";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import React from "react";
import { useSession } from "next-auth/react";
import { getSigner } from "@/lib/hooks/getSigner";
import toast from "react-hot-toast";

interface ICrowdSaleModal {
  isOpen: boolean;
  onClose: () => void;
}

const CrowdSaleModal: React.FC<ICrowdSaleModal> = ({ isOpen, onClose }) => {
  const [pak, setPak] = React.useState<IPackage>();
  const [rate, setRate] = React.useState<IRate>({ bnbRate: 0 });
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const { onOpen } = useModal();
  // redux
  const session = useSession();
  const getRate = React.useCallback(async () => {
    const crowdContract = new CrowdSaleContract();
    const bnbRate = await crowdContract.getBnbRate();
    setRate({ bnbRate });
  }, []);

  React.useEffect(() => {
    getRate();
  }, [getRate]);

  const handleBuyMKC = async (pk: IPackage) => {
    try {
      if (!session?.data) return;
      const signer = await getSigner(session?.data?.user?.wallet);
      setPak(pk);
      setIsProcessing(true);
      const crowdContract = new CrowdSaleContract(signer);
      const tx = await crowdContract.buyTokenByBNB(pk.amount);
      onOpen("success", { hash: tx, title: "BUY MARKET COINS" });
      await session.update({
        ...session?.data?.user,
        mkc: session?.data?.user?.mkc + pk.amount,
      });
    } catch (error) {
      toast.error("Buy MKC Failed!!!");
    } finally {
      onClose();
      setPak(undefined);
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      className="overflow-y-auto"
      size="5xl"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex gap-2 justify-center text-large m-2 border-b-[2px]">
          <HiOutlineShoppingCart size={24} /> Crowd Sales
        </ModalHeader>
        <ModalBody>
          <div className="gap-2 grid grid-cols-2 md:grid-cols-4">
            {packages.map((pk, index) => (
              <InvestCard
                pak={pk}
                key={index}
                isBuying={isProcessing && pak?.key === pk.key}
                rate={rate.bnbRate}
                onBuy={() => handleBuyMKC(pk)}
              />
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CrowdSaleModal;
