import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import HeatmapCalender from "./HeatmapCalendar";
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

    const mockdata = [
      { date: '2024-09-01', count: 5 },
      { date: '2024-09-02', count: 10 },
      { date: '2024-09-03', count: 0 },
      { date: '2024-09-04', count: 7 },
      { date: '2024-09-05', count: 12 },
      { date: '2024-09-06', count: 8 },
      { date: '2024-09-07', count: 6 },
      { date: '2024-09-08', count: 4 },
      { date: '2024-09-09', count: 9 },
      { date: '2024-09-10', count: 11 },
      { date: '2024-09-11', count: 15 },
      { date: '2024-09-12', count: 6 },
      { date: '2024-09-13', count: 8 },
      { date: '2024-09-14', count: 3 },
      { date: '2024-09-15', count: 7 },
      { date: '2024-09-16', count: 10 },
      { date: '2024-09-17', count: 14 },
      { date: '2024-09-18', count: 5 },
      { date: '2024-09-19', count: 9 },
      { date: '2024-09-20', count: 12 },
      { date: '2024-09-21', count: 7 },
      { date: '2024-09-22', count: 5 },
      { date: '2024-09-23', count: 11 },
      { date: '2024-09-24', count: 6 },
      { date: '2024-09-25', count: 8 },
      { date: '2024-09-26', count: 4 },
      { date: '2024-09-27', count: 9 },
      { date: '2024-09-28', count: 13 },
      { date: '2024-09-29', count: 3 },
      { date: '2024-09-30', count: 0 },
      { date: '2024-10-01', count: 6 },
      { date: '2024-10-02', count: 8 },
      { date: '2024-10-03', count: 5 },
      { date: '2024-10-04', count: 9 },
      { date: '2024-10-05', count: 12 },
      { date: '2024-10-06', count: 7 },
      { date: '2024-10-07', count: 11 },
      { date: '2024-10-08', count: 14 },
      { date: '2024-10-09', count: 0 },
      { date: '2024-10-10', count: 8 },
      { date: '2024-10-11', count: 15 },
      { date: '2024-10-12', count: 6 },
      { date: '2024-10-13', count: 8 },
      { date: '2024-10-14', count: 3 },
      { date: '2024-10-15', count: 7 },
      { date: '2024-10-16', count: 10 },
      { date: '2024-10-17', count: 14 },
      { date: '2024-10-18', count: 5 },
      { date: '2024-10-19', count: 9 },
      { date: '2024-10-20', count: 12 },
      { date: '2024-10-21', count: 7 },
      { date: '2024-10-22', count: 5 },
      { date: '2024-10-23', count: 11 },
      { date: '2024-10-24', count: 6 },
      { date: '2024-10-25', count: 8 },
      { date: '2024-10-26', count: 4 },
      { date: '2024-10-27', count: 9 },
      { date: '2024-10-28', count: 13 },
      { date: '2024-10-29', count: 3 },
      { date: '2024-10-30', count: 10 },
      { date: '2024-11-01', count: 6 },
      { date: '2024-11-02', count: 8 },
      { date: '2024-11-03', count: 5 },
      { date: '2024-11-04', count: 9 },
      { date: '2024-11-05', count: 12 },
      { date: '2024-11-06', count: 7 },
      { date: '2024-11-07', count: 11 },
      { date: '2024-11-08', count: 14 },
      { date: '2024-11-09', count: 4 },
      { date: '2024-11-10', count: 8 },
      { date: '2024-11-11', count: 1 },
      { date: '2024-11-12', count: 7 },
      { date: '2024-11-13', count: 12 },
      { date: '2024-11-14', count: 3 },
      { date: '2024-11-15', count: 7 },
      { date: '2024-11-16', count: 10 },
      { date: '2024-11-17', count: 14 },
      { date: '2024-11-18', count: 5 },
      { date: '2024-11-19', count: 9 },
      { date: '2024-11-20', count: 12 },
      { date: '2024-11-21', count: 7 },
      { date: '2024-11-22', count: 5 },
      { date: '2024-11-23', count: 11 },
      { date: '2024-11-24', count: 6 },
      { date: '2024-11-25', count: 8 },
      { date: '2024-11-26', count: 4 },
      { date: '2024-11-27', count: 9 },
      { date: '2024-11-28', count: 13 },
      { date: '2024-11-29', count: 3 },
      { date: '2024-11-30', count: 10 },
      { date: '2024-11-31', count: 10 },
      { date: '2024-12-01', count: 6 },
      { date: '2024-12-02', count: 8 },
      { date: '2024-12-03', count: 0 },
      { date: '2024-12-04', count: 9 },
      { date: '2024-12-05', count: 12 },
      { date: '2024-12-06', count: 7 },
      { date: '2024-12-07', count: 11 },
      { date: '2024-12-08', count: 14 },
      { date: '2024-12-09', count: 4 },
      { date: '2024-12-10', count: 8 },
      { date: '2024-12-11', count: 1 },
      { date: '2024-12-12', count: 7 },
      { date: '2024-12-13', count: 12 },
  ]

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
        <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Overview</h1>
        <Weekly weeklyMeals={weeklyValues} weeklyObjectives={weekDayObjectives}/>
{/*       <div className="border flex ">
        <HeatmapCalender startDate="2024-09-01" endDate='2024-12-13' dataValues={mockdata} />
      </div> */}
    </div>
  )
}