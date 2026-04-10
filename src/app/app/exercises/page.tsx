import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import ExerciseSkeleton from "./ExerciseSkeleton";
import ExerciseWrapper from "./ExerciseWrapper";

export default async function Page() { 

    // Validating Path if valid user // 
    const { user } = await validateRequest()
    if(!user) {
      return redirect("/")
    }
  
  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Exercises</h1>
        <Suspense fallback={<ExerciseSkeleton />}>
            <ExerciseWrapper userId={user.id} />
        </Suspense>
        <Toaster />
    </div>
  )
}