"use client";
import ReduxProvider from "@/reduxs/ReduxProvider";
import { NextUIProvider } from "@nextui-org/react";
import AuthProvider from "@/components/provider/AuthProvider";
import ToasterProvider from "@/components/provider/ToasterProvider";
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
          {children}
        </NextUIProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
