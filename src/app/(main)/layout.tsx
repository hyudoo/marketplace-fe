"use client";
import ReduxProvider from "@/reduxs/ReduxProvider";
import { NextUIProvider } from "@nextui-org/react";
import { MainLayout } from "@/layout/MainLayout";
import { ModalProvider } from "@/components/provider/ModalProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NextUIProvider>
          <ModalProvider />
          <MainLayout>{children}</MainLayout>
        </NextUIProvider>
      </LocalizationProvider>
    </ReduxProvider>
  );
}
