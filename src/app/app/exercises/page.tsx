import ExerciceBoard from "./ExerciceBoard";
import { getExerciceGroups, getExerciceData, getLabels } from "@/app/actions/db.actions/workout.actions";
import { validateRequest } from "@/lib/auth";
import { ExerciceGroup } from "@prisma/client";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { Labels } from "@prisma/client";
import ExerciseSkeleton from "./ExerciseSkeleton";

export default async function Page() { 

    // Validating Path if valid user // 
    const { user } = await validateRequest()
    if(!user) {
      return redirect("/")
    }
  
    const groups : Array<ExerciceGroup> = await getExerciceGroups(user.id);
    const exercicesData = await getExerciceData(user.id);
    const labels : Array<Labels> = await getLabels(user.id);
  
  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Exercises</h1>
        <Suspense fallback={<ExerciseSkeleton />}>
            <ExerciceBoard groups={groups} exercicesData={exercicesData} labels={labels} userId={user.id} />
        </Suspense>
        <Toaster />
    </div>
  )
}