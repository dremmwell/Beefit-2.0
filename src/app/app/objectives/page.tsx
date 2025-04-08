import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import CaloriesGoalCard from "./CaloriesGoalCard";
import { Toaster } from "@/components/ui/toaster";
import MacroGoalCard from "./MacroGoalCard";
import { getLatestObjective } from "@/app/actions/db.actions/objective.actions";
import CardWrapper from "./CardWrapper";
import { Suspense } from "react";
import CardsSkeleton from "./CardsSkeleton";

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }
 
  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Objectives</h1>
      <div className="flex gap-2 overflow-scroll no-scrollbar">
        <Suspense fallback={<CardsSkeleton />}>
         <CardWrapper user={user} />
        </Suspense>
      </div>
        <Toaster />
    </div>
  )
}