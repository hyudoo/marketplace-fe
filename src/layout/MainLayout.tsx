"use client";

import React from "react";
// import { menus } from "@/constants";
import { useAppSelector } from "@/reduxs/hooks";
import Navbar from "./Navbar";
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
