
import { getRecipesAndIngredients } from "@/app/actions/db.actions/recipe.actions";
import ExerciceBoard from "./ExerciceBoard";
import { getExerciceGroups, getExerciceData } from "@/app/actions/db.actions/workout.actions";
import { validateRequest } from "@/lib/auth";
import { ExerciceGroup } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page() { 

    // Validating Path if valid user // 
    const { user } = await validateRequest()
    if(!user) {
      return redirect("/")
    }
  
    const groups : Array<ExerciceGroup> = await getExerciceGroups(user.id);
    const exercicesData = await getExerciceData(user.id);
  
  return (
    <ExerciceBoard groups={groups} exercicesData={exercicesData} userId={user.id} />
  )
}