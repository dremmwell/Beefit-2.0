import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import { getIngredients} from "@/app/actions/db.actions/ingredient.actions";
import { getRecipesAndIngredients, getVariantRecipesAndIngredients } from "../../actions/db.actions/recipe.actions";
import { Ingredient } from "@prisma/client";
import { RecipeAndIngredients, StreakData, MealValues, MealData } from "../../types/definitions";
import CarouselStreack from "../dashboard/StreakCarousel";
import ChartsCards from "../today/ChartsCard";
import { Objective, ArchivedMeal } from "@prisma/client";
import { getLatestObjective } from "@/app/actions/db.actions/objective.actions";
import { getMealsByPeriod, getArchivedMealsByPeriod } from "@/app/actions/db.actions/meal.actions";


export default async function Dashboard() {

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const originalRecipes : Array<RecipeAndIngredients> = await getRecipesAndIngredients(user.id);
  const variantRecipes : Array<RecipeAndIngredients> = await getVariantRecipesAndIngredients(user.id);

  const recipes : Array<RecipeAndIngredients> = originalRecipes.concat(variantRecipes);
  const ingredients :Array<Ingredient> = await getIngredients(user.id);

  const mockDataCal : StreakData = {
    title : "Calories",
    value : 7,
    footer : "Keep it up !"
  }
  const mockDataCarb : StreakData = {
    title : "Carbohydrates",
    value : 5,
    footer : "Keep it up !"
  }
  const mockDataProt : StreakData = {
    title : "Proteins",
    value : 0,
    footer : "Let's start the streak!"
  }
  const mockDataFats : StreakData = {
    title : "Fats",
    value : 6,
    footer : "Keep it up !"
  }

  const carouselData : StreakData[] = [mockDataCal, mockDataCarb, mockDataProt, mockDataFats]

  return (
    <main className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Dashboard - {user.username}</h1>
        <div className="flex lg:mx-6">
          <CarouselStreack data={carouselData} />
        </div>
    </main>
  );
}
