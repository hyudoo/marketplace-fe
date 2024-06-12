import { Image } from "@nextui-org/react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        className="w-3/5 lg:w-1/5 mx-auto"
        src="empty-state.jpg"
        alt="empty-state"
      />
      <p className="text-2xl font-bold">No Product found</p>
      <p className="text-default-500">
        Try adjusting your search or filter options to find what you&apos;re
        looking for
      </p>
    </div>
  );
}
