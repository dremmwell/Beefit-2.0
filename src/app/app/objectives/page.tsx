import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import CaloriesGoalCard from "./CaloriesGoalCard";
import { Toaster } from "@/components/ui/toaster";
import MacroGoalCard from "./MacroGoalCard";
import { getLatestObjective } from "@/app/actions/db.actions/objective.actions";

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  const objective = await getLatestObjective(user.id);
 
  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Objectives</h1>
      <div className="flex gap-2 overflow-scroll no-scrollbar">
        <div className="flex flex-col gap-2 flex-1">
          <CaloriesGoalCard objective={objective} />
          <MacroGoalCard objective={objective} />
        </div>
      </div>
        <Toaster />
    </div>
  )
}