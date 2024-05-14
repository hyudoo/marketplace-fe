import { ModalProvider } from "@/components/provider/ModalProvider";
import Navbar from "@/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ModalProvider />
      <Navbar />
      {children}
    </>
  );
}
