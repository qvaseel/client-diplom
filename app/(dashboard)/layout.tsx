"use client";

import { Sidebar } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full relative">
      <Sidebar />
      <div className="flex flex-col lg:ml-[240px] w-full overflow-x-hidden px-4 sm:px-6 pt-12 lg:pt-4 lg:pl-4">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}