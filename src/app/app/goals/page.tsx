import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import GoalsSkeleton from "./goalsSkeleton";
import GoalsWrapper from "./GoalsWrapper";
import { DatePicker } from "@/components/DatePicker";

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Split Goals</h1>
        <Suspense fallback={<GoalsSkeleton />}>
        <div className="flex items-center lg:gap-4 gap-2 mt-1 mb-2">
          <h1 className="text-sm whitespace-nowrap">
            Current Split :
          </h1>
          <DatePicker />
        </div>
          <GoalsWrapper userId={user.id} />
        </Suspense>
        <Toaster />
    </div>
  )
}