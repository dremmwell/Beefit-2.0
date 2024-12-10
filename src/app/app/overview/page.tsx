import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getArchivedMealsByPeriod, getLatestObjective, getMealsByPeriod, getObjectiveByPeriod } from "@/app/actions/db.actions";
import { ArchivedMeal, Objective } from "@prisma/client";
import { MealData, MealValues, ObjectiveAndDate } from "@/app/types/definitions";
import Weekly from "./Weekly";
import { getMealValues, getArchivedMealsValues } from "@/lib/meal_utils";
import { setObjectiveForEachDay } from "@/lib/objective_utils";
  
export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  const today : Date = new Date()

  const endDate  : Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  const startDate : Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8)

  //Get Meals and custom ("archived") meals from DB//
  const weeklyMeals : Array<MealData> = await getMealsByPeriod(user.id, startDate, endDate);
  const weeklyArchivedMeals : Array<ArchivedMeal> = await getArchivedMealsByPeriod(user.id, startDate, endDate);

  //Extract nutritional values from each meals and merge the 2 meal arrays//
  const weeklyMealValues : MealValues[] = getMealValues(weeklyMeals)
  const weeklyArchivedValues : MealValues[] = getArchivedMealsValues(weeklyArchivedMeals)
  const weeklyValues : MealValues[] = weeklyMealValues.concat(weeklyArchivedValues)

  const weeklyObjectives : Array<Objective> = await getObjectiveByPeriod(user.id, startDate, endDate)
  const lastestObjective : Objective = await getLatestObjective(user.id);

  const weekDayObjectives : ObjectiveAndDate[] = setObjectiveForEachDay(lastestObjective, weeklyObjectives, startDate, endDate)

  return (
    <div className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 col-span-2">Week Overview</h1>
        <div className="flex flex-col lg:flex-row gap-4 max-h-fit min-h-0 my-4 xl:mx-12">
          <div className="flex flex-1 flex-col">
             <Weekly weeklyMeals={weeklyValues} weeklyObjectives={weekDayObjectives}/>
          </div>
        </div>
    </div>
  )
}