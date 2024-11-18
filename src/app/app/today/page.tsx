import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import MacroChart from "./MacroChart";
import { ScrollArea } from "@/components/ui/scroll-area";
import Timeline from "./TimeLine";
import CaloriesChart from "./CaloriesChart";
import { AddMealDialog } from "./AddMealDialog";
import { RecipeAndIngredients, MealData, MealValues, Objective } from "@/app/types/definitions";
import { Ingredient, Meal, Recipe, RecipeIngredient } from "@prisma/client";
import { getRecipesAndIngredients, getIngredients, getMealsByDate, getVariantRecipesAndIngredients} from "@/app/actions/db.actions";
import Diary from "./Diary";
import { getMealValues, sumMealValues } from "@/lib/recipe_utils";

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

  const objective : Objective = {
    calories : 2200,
    proteins : 150,
    carbs : 350,
    fats : 75,
  }

  return (
    <div className="container sm:my-10 my-5 flex flex-col min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2 col-span-2">Today</h1>
      <div className="flex lg:flex-row flex-col gap-4 max-h-fit min-h-0 my-4 lg:mx-12">
          <div className="flex lg:flex-col gap-4">
            <CaloriesChart values={todaysValues} objective={objective}/>
            <MacroChart values={todaysValues} objective={objective}/>
          </div>
           <Diary meals={todaysMeals} recipes={recipes} ingredients={ingredients}/>
      </div>
    </div>
  )
}
