import Link from "next/link";
import { Image } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col items-center justify-center h-full">
        <Image
          className="w-3/5 lg:w-1/5 mx-auto"
          src="error.jpg"
          alt="empty-state"
        />
        <div>
          <Link href="/" className="hover:text-cyan-500">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
