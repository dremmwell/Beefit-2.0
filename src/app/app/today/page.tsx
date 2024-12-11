import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RecipeAndIngredients, MealData, MealValues } from "@/app/types/definitions";
import { ArchivedMeal, Ingredient, Objective } from "@prisma/client";
import { getRecipesAndIngredients, getIngredients, getMealsByDate, getVariantRecipesAndIngredients, getLatestObjective, getMealsByPeriod, getArchivedMealsByPeriod} from "@/app/actions/db.actions";
import Diary from "./Diary";
import { getArchivedMealsValues, getMealValues, sumMealValues } from "@/lib/meal_utils";
import ChartsCards from "./ChartsCard";

export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

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
    <div className="container sm:my-10 my-2 flex flex-col min-h-0 px-3 sm:px-10">
        <div className="scroll-m-20 border-b text-3xl font-semibold tracking-tight flex justify-between"><span>Today</span><span className="display md:hidden text-xl content-center">{today.toLocaleString("en-GB", {month : 'long', day : 'numeric', year : 'numeric'})}</span></div>
      <div className="flex flex-col lg:flex-row gap-4 max-h-fit min-h-0 my-4 xl:mx-12">
          <ChartsCards values={todaysValuesSum} objective={objective} date={today}/>
          <Diary mealValues={todaysValues} recipes={recipes} ingredients={ingredients}/>
      </div>
    </div>
  )
}
