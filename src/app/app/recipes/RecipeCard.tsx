
import { Ingredient, Recipe, RecipeIngredient } from '@prisma/client'
import { getIngredients, getRecipeIngredients } from "@/app/actions/db.actions"
import db from "@/db/db"
import InfoCard from "./InfoCard";
import { IngredientInRecipe } from "@/app/types/definitions";


interface RecipeCardProps {
    recipe: Recipe,
}

export default async function RecipeCard({recipe}: RecipeCardProps) {

  const ingredientsInRecipe: Array<IngredientInRecipe>= [];

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
  
  return (
    <InfoCard recipe={recipe} ingredientsInRecipe={ingredientsInRecipe}/>
  );
}
