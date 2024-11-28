import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import MacroChart from "./MacroChart";
import CaloriesChart from "./CaloriesChart";
import { RecipeAndIngredients, MealData, MealValues } from "@/app/types/definitions";
import { Ingredient, Objective } from "@prisma/client";
import { getRecipesAndIngredients, getIngredients, getMealsByDate, getVariantRecipesAndIngredients, getLatestObjective} from "@/app/actions/db.actions";
import Diary from "./Diary";
import { getMealValues, sumMealValues } from "@/lib/meal_utils";

export default async function Page() { 

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const originalRecipes : Array<RecipeAndIngredients> = await getRecipesAndIngredients(user.id);
  const variantRecipes : Array<RecipeAndIngredients> = await getVariantRecipesAndIngredients(user.id);
  const recipes : Array<RecipeAndIngredients> = originalRecipes.concat(variantRecipes);

  const ingredients :Array<Ingredient> = await getIngredients(user.id);

  const today = new Date();
  const todaysMeals : Array<MealData> = await getMealsByDate(user.id,today);

  const todaysValues : MealValues = sumMealValues(getMealValues(todaysMeals));

  const objectives : Objective[] = await getLatestObjective(user.id);
  const objective : Objective = objectives[0];

  return (
    <div className="container sm:my-10 my-2 flex flex-col min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 col-span-2">Today</h1>
      <div className="flex flex-col xl:flex-row  gap-4 max-h-fit min-h-0 my-4 lg:mx-12">
          <div className="flex flex-col md:flex-row xl:flex-col md:gap-4 gap-2">
            <CaloriesChart values={todaysValues} objective={objective}/>
            <MacroChart values={todaysValues} objective={objective}/>
          </div>
           <Diary meals={todaysMeals} recipes={recipes} ingredients={ingredients}/>
      </div>
    </div>
  )
}
