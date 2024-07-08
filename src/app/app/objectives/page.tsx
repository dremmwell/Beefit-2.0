import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  
  return (
    <div className="container my-10 flex flex-col gap-2">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Objectives</h1>
    </div>
  )
}