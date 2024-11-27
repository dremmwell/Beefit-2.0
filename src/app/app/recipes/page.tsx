import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import db from "@/db/db";
import RecipeCard from "./RecipeCard";
import { RecipeAndIngredients } from "@/app/types/definitions";
import { User } from "lucia";
import { AddRecipeDialog } from "./AddRecipeDialog";
import SearchBar from "./SearchBar";
import { getIngredients, getRecipesAndIngredients } from "@/app/actions/db.actions";
import { Toaster } from "@/components/ui/toaster";
import { Ingredient } from "@prisma/client";

export default async function Page(
  {
    searchParams
  }: {
    searchParams: { [key: string]: string | string[] | undefined }
  }
) { 

// Validating Path if valid user //  
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  const recipes :Array<RecipeAndIngredients> = await getRecipesAndIngredients(user.id);
  const ingredients :Array<Ingredient> = await getIngredients(user.id);

  // Page prop "searchParams" gets search param in the url //
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  const filteredRecipes = recipes.filter((recipe : RecipeAndIngredients) => {
    if (!recipe || !recipe.name) return false;
    if (!search) return recipes;
    const lowerCaseName = recipe.name.toLowerCase();
    const lowerCaseSearchTerm = search.toLowerCase();
    return lowerCaseName.includes(lowerCaseSearchTerm);
  });

  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Recipes</h1>
      <div className="flex py-4">
          <SearchBar />
        <div className="ml-auto">
          <AddRecipeDialog ingredients={ingredients}/> 
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-scroll no-scrollbar">
        {filteredRecipes.map((recipe: RecipeAndIngredients) => (
            <RecipeCard key={recipe.id} recipe={recipe} ingredients={ingredients}/>
        ))}
      </div>
        <Toaster />
    </div>
  )
}