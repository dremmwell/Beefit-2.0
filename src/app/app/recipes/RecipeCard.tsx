import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Ingredient, Recipe, RecipeIngredient } from '@prisma/client'
  import { getIngredients, getRecipeIngredients } from "@/app/actions/db.actions"
  import db from "@/db/db"


interface RecipeCardProps {
    recipe: Recipe,
}

export default async function RecipeCard({recipe}: RecipeCardProps) {

  const ingredientsInRecipe: Array<any>= [];

  const recipeIngredients: Array<RecipeIngredient> = await getRecipeIngredients(recipe);
  
  // Fetch all ingredients using Promise.all()
  await Promise.all(recipeIngredients.map(async (recipeIngredient: RecipeIngredient) => {
      const ingredientData = await db.ingredient.findUnique({
          where: {
              id: recipeIngredient.ingredientId 
            }
      });
      if (ingredientData) {
          const ingredientInRecipe = {...ingredientData, gramsInRecipe: recipeIngredient.grams}
          ingredientsInRecipe.push(JSON.parse(JSON.stringify(ingredientInRecipe)));
      }
  }));

  console.log(ingredientsInRecipe);

  return (
      <Card key={recipe.id}>
          <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
          </CardHeader>
          <CardContent>
          </CardContent>
      </Card>
  );
}
