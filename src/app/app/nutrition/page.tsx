import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() { 

      // Validating Path if valid user // 
    const { user } = await validateRequest()
      if(!user) {
        return redirect("/")
      }
    
    return (
      <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Welcome to your nutrition app !</h1>
        Nutrition tutorial coming soon, in the meantime feel free to explore the app and create your own meal plan !
      </div>
    )
}