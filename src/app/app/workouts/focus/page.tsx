
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getFocus } from "@/app/actions/db.actions/workout.actions";
import { get } from "lodash";
import PriorityBoard from "./PriorityBoard";

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  const focus = await getFocus(user.id);
  
  return (
    <div className="container sm:my-10 my-2 flex flex-col min-h-0 px-3 sm:px-10">
      <PriorityBoard focus={focus} />
    </div>
  )
}