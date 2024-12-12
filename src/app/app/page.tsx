import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import { getRecipesAndIngredients, getIngredients, getVariantRecipesAndIngredients} from "@/app/actions/db.actions";
import { Ingredient } from "@prisma/client";
import { RecipeAndIngredients } from "../types/definitions";

export default async function Dashboard() {

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const originalRecipes : Array<RecipeAndIngredients> = await getRecipesAndIngredients(user.id);
  const variantRecipes : Array<RecipeAndIngredients> = await getVariantRecipesAndIngredients(user.id);

  const recipes : Array<RecipeAndIngredients> = originalRecipes.concat(variantRecipes);
  const ingredients :Array<Ingredient> = await getIngredients(user.id);

    return (
      <main className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
          <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Dashboard - {user.username}</h1>
      </main>
    );
  }
