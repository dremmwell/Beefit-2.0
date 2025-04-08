import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import db from "@/db/db";
import RecipeCard from "./RecipeCard";
import { RecipeAndIngredients } from "@/app/types/definitions";
import { User } from "lucia";
import { AddRecipeDialog } from "./AddRecipeDialog";
import SearchBar from "./SearchBar";
import { getIngredients } from "@/app/actions/db.actions/ingredient.actions";
import { createArchivedRecipe, getRecipesAndIngredients } from "@/app/actions/db.actions/recipe.actions";
import { Toaster } from "@/components/ui/toaster";
import { Ingredient } from "@prisma/client";
import RecipeGrid from "./RecipeGrid";
import { Suspense } from "react";
import RecipeGridSkeleton from "./RecipeGridSkeleton";

export default async function Page(
   {
          searchParams,
        }: {
          searchParams: { [key: string]: string | string[] | undefined },
        }
) { 

// Validating Path if valid user //  
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

  return (
    <div className="container sm:my-10 my-2 flex flex-col max-h-fit min-h-0 px-3 sm:px-10">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0 mb-2">Recipes</h1>
      <div className="flex py-4">
          <SearchBar />
        <div className="ml-auto">
          <AddRecipeDialog user={user}/> 
        </div>
      </div>
      <Suspense fallback={<RecipeGridSkeleton />}>
        <RecipeGrid user={user} searchParams={searchParams}/>
      </Suspense>
        <Toaster />
    </div>
  )
}