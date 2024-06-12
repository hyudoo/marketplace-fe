import { Image, Link } from "@nextui-org/react";
interface IEmptyExchange {
  onOpen: () => void;
}

const EmptyExchange: React.FC<IEmptyExchange> = ({ onOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        className="w-3/5 lg:w-1/5 mx-auto"
        src="empty-state.jpg"
        alt="empty-state"
      />
      <p className="text-2xl font-bold">No Exchange found</p>
      <p className="text-default-500">
        You don&apos;t have any exchange yet,{" "}
        <Link onClick={onOpen} className="hover:cursor-pointer">
          Create One
        </Link>
      </p>
    </div>
  );
};

export default EmptyExchange;
