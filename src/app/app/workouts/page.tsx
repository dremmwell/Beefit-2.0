import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import WorkoutTabs from "./WorkoutTabs"
import { getFocus, getLabels } from "@/app/actions/db.actions/workout.actions";
import WorkoutWrapper from "./WorkoutWrapper";

export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  return (
    <div className="container sm:my-10 my-2 flex flex-col min-h-0 px-3 sm:px-10">
        <div className="scroll-m-20 border-b text-3xl font-semibold tracking-tight flex justify-between">Workouts</div>
        <Suspense fallback={<div>Loading...</div>}>
          <WorkoutWrapper user={user} />
        </Suspense>
    </div>
  )
}