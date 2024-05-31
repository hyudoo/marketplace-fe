"use client";
import { NextUIProvider } from "@nextui-org/react";
import AuthProvider from "@/components/provider/AuthProvider";
import ToasterProvider from "@/components/provider/ToasterProvider";
import { ModalProvider } from "@/components/provider/ModalProvider";
import Navbar from "@/layout/Navbar";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextUIProvider>
      <AuthProvider>
        <ToasterProvider />
        <ModalProvider />
        <Navbar />
        {children}
      </AuthProvider>
    </NextUIProvider>
  );
}
