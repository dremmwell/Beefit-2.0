import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import type React from "react"
import NavTabs from "../../../components/nav-tab"

const workoutTabs = [
  { label: "Focus", href: "/app/workouts/focus" },
  { label: "Exercices", href: "/app/workouts/exercices" },
  { label: "Progress", href: "/app/workouts/progress" },
]

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
    
    return (
      <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
        <div className="flex lg:gap-2 flex-col sm:flex-row items-start border-b pb-2 lg:pb-0">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-1">Workouts</h1>
          <NavTabs tabs={workoutTabs} className="w-full lg:w-1/3" />
        </div>
        <div className="flex flex-col max-h-fit min-h-0 mt-4 lg:mt-6">
          {children}
        </div>
      </div>
    )
  }