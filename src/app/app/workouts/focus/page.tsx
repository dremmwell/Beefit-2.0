
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFocus } from "@/app/actions/db.actions/workout.actions";
import { Suspense } from "react";
import PriorityBoard from "./PriorityBoard";
import FocusSkeleton from "./FocusSkeleton";

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  const focus = await getFocus(user.id);
  
  return (
    <Suspense fallback={<FocusSkeleton />}>
      <PriorityBoard focus={focus} />
    </Suspense>
  )
}