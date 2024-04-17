"use client";
import ReduxProvider from "@/reduxs/ReduxProvider";
import { NextUIProvider } from "@nextui-org/react";
import { MainLayout } from "@/layout/MainLayout";
import { ModalProvider } from "@/components/provider/ModalProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <NextUIProvider>
        <ModalProvider />
        <MainLayout>{children}</MainLayout>
      </NextUIProvider>
    </ReduxProvider>
  );
}
