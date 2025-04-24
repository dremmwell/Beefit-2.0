import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserInfo } from "../actions/db.actions/user.action";

export default async function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

      // Validating Path if valid user // 
    const { user } = await validateRequest()
      if(!user) {
        return redirect("/")
      }
      const userInfo = await getUserInfo(user)
    
    return (
      <>
        <SideBar user={userInfo}/>
          {children}
        <Toaster />
      </>
    )
  }