import React from 'react'
import { User } from 'lucia';
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

async function TodayWrapper( {user} : { user :User}) {


  //---------------------------Db calls for recipes and ingredients for meal forms----------------------------------//

  const originalRecipes : Array<RecipeAndIngredients> = await getRecipesAndIngredients(user.id);
  const variantRecipes : Array<RecipeAndIngredients> = await getVariantRecipesAndIngredients(user.id);
  const recipes : Array<RecipeAndIngredients> = originalRecipes.concat(variantRecipes);

  const ingredients :Array<Ingredient> = await getIngredients(user.id);

  //---------------------------Db calls for meals and custom meals for todays date----------------------------------//

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

  //Get Meals and custom ("archived") meals from DB//
  const todaysMeals : Array<MealData> = await getMealsByPeriod(user.id, startDate, endDate);
  const todaysArchivedMeals : Array<ArchivedMeal> = await getArchivedMealsByPeriod(user.id, startDate, endDate);

  //Extract nutritional values from each meals and merge the 2 arrays//
  const todaysMealValues : MealValues[] = getMealValues(todaysMeals)
  const todaysArchivedMealValues : MealValues[] = getArchivedMealsValues(todaysArchivedMeals)
  const todaysValues : MealValues[] = todaysMealValues.concat(todaysArchivedMealValues)

  //Sums all meals values to get todays nutritional values//
  const todaysValuesSum : MealValues = sumMealValues(todaysValues);

  //---------------------------Db calls for the lastest objective----------------------------------//
  const objective : Objective = await getLatestObjective(user.id);

  return (
    <div  className="flex flex-col lg:flex-row gap-4 max-h-fit min-h-0 my-4 xl:mx-12">
        <ChartsCards values={todaysValuesSum} objective={objective} date={today}/>
        <Diary mealValues={todaysValues} recipes={recipes} ingredients={ingredients}/>
    </div>
  )
}

export default TodayWrapper
