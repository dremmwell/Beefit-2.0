import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecipeAndIngredients, MealData, MealValues } from "@/app/types/definitions";
import { ArchivedMeal, Ingredient, Objective } from "@prisma/client";

import { getRecipesAndIngredients, getVariantRecipesAndIngredients } from "@/app/actions/db.actions/recipe.actions";
import { getIngredients } from "@/app/actions/db.actions/ingredient.actions";
import { getMealsByDate } from "@/app/actions/db.actions/meal.actions";
import { getLatestObjective } from "@/app/actions/db.actions/objective.actions";
import { getMealsByPeriod, getArchivedMealsByPeriod } from "@/app/actions/db.actions/meal.actions";

import Diary from "./Diary";
import { getArchivedMealsValues, getMealValues, sumMealValues } from "@/lib/meal_utils";
import ChartsCards from "./ChartsCard";
import { Suspense } from "react";
import TodayWrapper from "./TodayWrapper";
import TodaySkeleton from "./TodaySkeleton";

export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const today = new Date();

  return (
    <div className="container sm:my-10 my-2 flex flex-col min-h-0 px-3 sm:px-10">
        <div className="scroll-m-20 border-b text-3xl font-semibold tracking-tight flex justify-between"><span>Today</span><span className="display md:hidden text-xl content-center">{today.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}</span></div>
        <Suspense fallback={<TodaySkeleton />}>
          <TodayWrapper user={user}/>
        </Suspense>
    </div>
  )
}
