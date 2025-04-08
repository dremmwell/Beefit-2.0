import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react"

import Table from "./Table"


;
import TableSkeleton from "./TableSkeleton";


export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  return (
    <>
      <div className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Ingredients</h1>
          <Suspense fallback={<TableSkeleton />}>
            <Table user={user}/>
          </Suspense>
      </div>
    </>
  )
}
