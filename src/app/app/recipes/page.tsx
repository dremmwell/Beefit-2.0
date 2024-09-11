import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import db from "@/db/db";
import RecipeCard from "./RecipeCard";
import { RecipeData } from "@/app/types/definitions";
import { User } from "lucia";
import { AddRecipeDialog } from "./AddRecipeDialog";
import SearchBar from "./SearchBar";
import { getIngredients } from "@/app/actions/db.actions";


async function getRecipesAndIngredients(user : User) {
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
  return recipes
}

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

  const recipes = await getRecipesAndIngredients(user);
  const ingredients = await getIngredients(user.id)

  // Page prop "searchParams" gets search param in the url //
  const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

  const filteredRecipes = recipes.filter((recipe : RecipeData) => {
    if (!recipe || !recipe.name) return false;
    if (!search) return recipes;
    const lowerCaseName = recipe.name.toLowerCase();
    const lowerCaseSearchTerm = search.toLowerCase();
    return lowerCaseName.includes(lowerCaseSearchTerm);
  });



  return (
    <div className="container my-10 flex flex-col gap-2">
      <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Recipes</h1>
      <div className="flex py-4">
          <SearchBar />
        <div className="ml-auto">
          <AddRecipeDialog ingredients={ingredients}/> 
        </div>
      </div>
      <ScrollArea>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-scroll no-scrollbar mr-4">
          {filteredRecipes.map((recipe: RecipeData) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}