import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import db from "@/db/db";
import RecipeCard from "./RecipeCard";
import { RecipeData } from "@/app/types/definitions";

export default async function Page() { 
  
  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  const data = await db.recipe.findMany({
    where: {
      userId: user.id
    },
    include:{
      ingredients: {
        include: {
          ingredient: true
        }
      }
    }
  });
  const recipes = JSON.parse(JSON.stringify(data));

  return (
    <div className="container my-10 flex flex-col gap-2">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Recipes</h1>
      <div>
        SearchBar
      </div>
      <ScrollArea>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-scroll no-scrollbar mr-4">
          {recipes.map((recipe: RecipeData) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}