import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import LogInLoading from "@/components/logInLoading";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
        <SideBar />
          {children}
        <Toaster />
      </>
    )
  }