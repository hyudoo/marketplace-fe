"use client";
import ReduxProvider from "@/reduxs/ReduxProvider";
import { Navbar, NextUIProvider } from "@nextui-org/react";
import AuthProvider from "@/components/provider/AuthProvider";
import ToasterProvider from "@/components/provider/ToasterProvider";
import { ModalProvider } from "@/components/provider/ModalProvider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <AuthProvider>
        <NextUIProvider>
          <ToasterProvider />
          <ModalProvider />
          <Navbar />
          {children}
        </NextUIProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
