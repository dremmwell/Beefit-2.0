import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import OverviewWrapper from "./OverviewWrapper";
import { Suspense } from "react";
import OverviewSkeleton from "./OverviewSkeleton";

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }



  return (
    <div className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 col-span-2">Overview</h1>
      <Suspense fallback={<OverviewSkeleton/>}>
        <OverviewWrapper user={user}/>
      </Suspense>
    </div>
  )
}
 