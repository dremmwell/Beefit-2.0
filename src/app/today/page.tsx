import { ScrollArea } from "@/components/ui/scroll-area"

export default async function Page() { 
  
  return (
    <div className="container my-10 flex flex-col gap-2">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Today</h1>
    <ScrollArea className="h-full w-3/5 rounded-md border p-4"> 

    </ScrollArea>
    
    </div>
  )
}