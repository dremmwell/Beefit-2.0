
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFocus } from "@/app/actions/db.actions/workout.actions";
import { Suspense } from "react";
import PriorityBoard from "./PriorityBoard";
import FocusSkeleton from "./FocusSkeleton";
import { Toaster } from "@/components/ui/toaster";
import { AddRecipeDialog } from "../recipes/AddRecipeDialog";
import SearchBar from "../recipes/SearchBar";

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  const focus = await getFocus(user.id);
  
  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Focus</h1>
        <Suspense fallback={<FocusSkeleton />}>
{/*           <PriorityBoard focus={focus} userId={user.id} /> */}
          <FocusSkeleton />
        </Suspense>
        <Toaster />
    </div>
  )
}