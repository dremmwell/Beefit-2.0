import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";

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