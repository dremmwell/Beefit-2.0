import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Dumbbell, Tag, BarChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";

export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }
  else {
    redirect("/app/workouts/progress")
  }
}