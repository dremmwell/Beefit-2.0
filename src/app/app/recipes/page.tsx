import { getRecipeIngredients, getRecipes } from "@/app/actions/db.actions";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import RecipeCard from "./RecipeCard";
import { ScrollArea } from "@/components/ui/scroll-area";


export default async function Page() { 
  
  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const recipes = await getRecipes(user.id);

  return (
    <div className="container my-10 flex flex-col gap-2">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Recipes</h1>
      <div>
        SearchBar
      </div>
      <ScrollArea>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-scroll no-scrollbar mr-4">
          {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe}></RecipeCard>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}