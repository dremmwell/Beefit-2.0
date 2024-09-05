import { getRecipeIngredients, getRecipes } from "@/app/actions/db.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import RecipeCard from "./RecipeCard";


export default async function Page() { 
  
  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const recipes = await getRecipes(user.id);

  return (
    <div className="container my-10 flex flex-col gap-2">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Recipes</h1>
      <div className="grid grid-cols-5 gap-8">
        {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe}></RecipeCard>
        ))}
      </div>
    </div>
  )
}