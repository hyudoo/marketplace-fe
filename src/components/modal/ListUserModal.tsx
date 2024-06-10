import {
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar,
  Pagination,
  PaginationItemRenderProps,
  PaginationItemType,
  Input,
} from "@nextui-org/react";
import React from "react";
import {
  IoChevronBackOutline,
  IoChevronForward,
  IoSearch,
} from "react-icons/io5";
import { IUserInfo } from "@/_types_";
import { useRouter } from "next/navigation";

interface IListUserModalProps {
  users: IUserInfo[];
  isOpen: boolean;
  onClose: () => void;
}

const ListUserModal: React.FC<IListUserModalProps> = ({
  users,
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const [index, setIndex] = React.useState<number>(1);
  const [total, setTotal] = React.useState(Math.ceil(users?.length! / 10));
  const [items, setItems] = React.useState<IUserInfo[]>();
  const [search, setSearch] = React.useState<string>("");
  const [filteredList, setFilteredList] = React.useState<IUserInfo[]>(users);

  React.useEffect(() => {
    const timeOut = setTimeout(() => {
      if (search?.length > 0) {
        const filteredList = users?.filter((product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredList(filteredList);
        setTotal(Math.ceil(filteredList?.length! / 10));
      } else {
        setTotal(Math.ceil(users?.length! / 10));
        setFilteredList(users);
      }
    }, 1500);
    return () => clearTimeout(timeOut);
  }, [search, users]);
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onNext}>
          <IoChevronForward />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
          onClick={onPrevious}>
          <IoChevronBackOutline />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }

    // cursor is the default item
    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          className,
          isActive &&
            "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold"
        )}
        onClick={() => setPage(value)}>
        {value}
      </button>
    );
  };

  React.useEffect(() => {
    const start = (index - 1) * 10;
    const end = index * 10;
    setItems(filteredList?.slice(start, end));
  }, [index, filteredList]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      placement="center"
      className="overflow-y-auto"
      onClose={onClose}>
      <ModalContent>
        <ModalHeader className="justify-center text-large m-2 border-b-2">
          LIST USER
        </ModalHeader>
        <ModalBody className="mb-2">
          <div className="w-full mb-2 rounded-2xl flex justify-center items-center bg-white ">
            <Input
              classNames={{
                label: "text-black/50 dark:text-white/90",
                input: [
                  "bg-transparent",
                  "text-black/90 dark:text-white/90",
                  "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                ],
                innerWrapper: "bg-transparent",
                inputWrapper: [
                  "shadow-xl",
                  "bg-default-200/50",
                  "dark:bg-default/60",
                  "backdrop-blur-xl",
                  "backdrop-saturate-200",
                  "hover:bg-default-200/70",
                  "dark:hover:bg-default/70",
                  "group-data-[focus=true]:bg-default-200/50",
                  "dark:group-data-[focus=true]:bg-default/60",
                  "!cursor-text",
                ],
              }}
              placeholder="Type to search..."
              size="sm"
              startContent={<IoSearch />}
              type="search"
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            />
          </div>
          {items?.map((profile, index) => (
            <div className="flex justify-between" key={index}>
              <div
                className="col-span-2 flex items-center hover:text-cyan-600 hover:cursor-pointer"
                onClick={() => router.push(`/account/${profile?.id}`)}>
                <Avatar
                  isFocusable
                  className="w-6 h-6 mr-3 text-tiny"
                  isBordered
                  alt="NextUI Fruit Image with Zoom"
                  src={profile?.avatar}
                />
                <div className="hover:border-b-1 items-center border-cyan-800">
                  {profile?.name || "Unnamed"}
                </div>
              </div>
              <Button
                size="sm"
                radius="full"
                color="primary"
                onClick={() => router.push(`/exchange/${profile?.id}`)}>
                Create Exchange
              </Button>
            </div>
          ))}
          {total > 1 && (
            <div className="w-full flex justify-center mt-4">
              <Pagination
                className="gap-2"
                showControls
                total={total}
                initialPage={1}
                renderItem={renderItem}
                radius="full"
                variant="light"
                onChange={(value) => setIndex(value)}
              />
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ListUserModal;
