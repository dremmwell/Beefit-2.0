import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function Page(
   {
          searchParams,
        }: {
          searchParams: { [key: string]: string | string[] | undefined },
        }
) { 

// Validating Path if valid user //  
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Page under construction - come back soon !</h1>
    </div>
  )
}