import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getArchivedMealsByPeriod, getMealsByPeriod, getObjectives } from "@/app/actions/db.actions";
import { ArchivedMeal, Objective } from "@prisma/client";
import { MealData, MealValues, DayData } from "@/app/types/definitions";
import Weekly from "./Weekly";
import { getMealValues, getArchivedMealsValues, sumMealValues } from "@/lib/meal_utils";
import { getDayObjective } from "@/lib/objective_utils";
import { WeekGraph } from "./WeekGraph";

function getMealsCreatedOnDate(mealValues: MealValues[], date: Date): MealValues[] {

  // Filter meals created on the given date
  return mealValues.filter(meal => {
      const mealCreatedAt = new Date(meal.createdAt);
      return (
          mealCreatedAt.getFullYear() === date.getFullYear() &&
          mealCreatedAt.getMonth() === date.getMonth() &&
          mealCreatedAt.getDate() === date.getDate()
      );
  });
}

function getDayColor(objective : Objective, mealValues : MealValues[]){

  const values = sumMealValues(mealValues);

  let dayColor: string = ""
  if(objective.calories < values.calories){
      dayColor = "primary"
  }
  else if(objective.calories * 0.5 < values.calories){
      dayColor = "success"
  }
  else{
      dayColor = "below"
  }
  return dayColor
}

export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  const today : Date = new Date()
  const endDate  : Date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startDate : Date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)

  //Get Meals and custom ("archived") meals from DB//
  const weeklyMeals : Array<MealData> = await getMealsByPeriod(user.id, startDate, endDate);
  const weeklyArchivedMeals : Array<ArchivedMeal> = await getArchivedMealsByPeriod(user.id, startDate, endDate);

  //Extract nutritional values from each meals and merge the 2 meal arrays//
  const weeklyMealValues : MealValues[] = getMealValues(weeklyMeals)
  const weeklyArchivedValues : MealValues[] = getArchivedMealsValues(weeklyArchivedMeals)
  const weeklyValues : MealValues[] = weeklyMealValues.concat(weeklyArchivedValues)

  //Get Objectives from DB
  const objectives : Objective[] = await getObjectives(user.id);

  //Format data to set for each day of the week its meals values, objectives and color
  const weekData : DayData[] = []

  for (let i = 1; i <= 7; i++) {
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const mealValuesOnDay = getMealsCreatedOnDate(weeklyValues, startOfDay);
    const objectiveOnDay = getDayObjective(objectives, startOfDay);
    const dayColor = getDayColor(objectiveOnDay, mealValuesOnDay)
    const dayData : DayData = {
      objective : objectiveOnDay,
      mealsValues : mealValuesOnDay,
      date : startOfDay,
      color: dayColor
    }
    weekData.push(dayData)
  }
  //Order the weekData list by date
  const weekDataOrdered : DayData[] = weekData.sort((a,b) =>  a.date.getTime() - b.date.getTime() )

  return (
    <div className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 col-span-2">Overview</h1>
          <div className="flex flex-col md:flex-row gap-4 md:mt-4">
             <Weekly weekData={weekDataOrdered}/>
             <div className="w-full">
                <WeekGraph weekData={weekDataOrdered} />
             </div>
        </div>
    </div>
  )
}
