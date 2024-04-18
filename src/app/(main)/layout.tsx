"use client";
import ReduxProvider from "@/reduxs/ReduxProvider";
import { NextUIProvider } from "@nextui-org/react";
import { ModalProvider } from "@/components/provider/ModalProvider";
import Navbar from "@/layout/Navbar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <NextUIProvider>
        <ModalProvider />
        <Navbar />
        {children}
      </NextUIProvider>
    </ReduxProvider>
  );
}
