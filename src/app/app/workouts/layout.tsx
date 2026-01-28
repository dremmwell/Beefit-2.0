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
        <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Workouts</h1>
        <NavTabs tabs={workoutTabs} className="mb-8" />
        <div>{children}</div>
      </div>
    </div>
    )
  }