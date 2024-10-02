"use server"

import db from "@/db/db";
import { Ingredient, Recipe, RecipeIngredient } from '@prisma/client';
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

// Ingredients CRUD operations //

export async function getIngredients(userId: UserId) {
    const data = await db.ingredient.findMany({
      where: {
        userId: userId
      }
    });
    const ingredients = JSON.parse(JSON.stringify(data));
    return ingredients
}

export async function createIngredient(ingredient: Ingredient) {
  const { user } = await validateRequest()
  if(user) {
    await db.ingredient.create({
      data: {
        id: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
        gramsPerUnit: ingredient.gramsPerUnit,
        calories: ingredient.calories,
        proteins: ingredient.proteins,
        carbs: ingredient.carbs,
        fats: ingredient.fats,
        userId: user.id,
      }
    });
    revalidatePath('/app/ingredients')
  }
}
  
export async function updateIngredient(ingredient:Ingredient) {
    await db.ingredient.update({
      where : {
        id: ingredient.id
      },
      data: {
        name: ingredient.name,
        unit: ingredient.unit,
        gramsPerUnit: ingredient.gramsPerUnit,
        calories: ingredient.calories,
        proteins: ingredient.proteins,
        carbs: ingredient.carbs,
        fats: ingredient.fats,
        userId: ingredient.userId,
        updatedAt: new Date()
      }
    })
    revalidatePath('/app/ingredients')
}
  
export async function deleteIngredient(ingredient: Ingredient) {
  const { user } = await validateRequest()
  if(user){
    if(user.id === ingredient.userId){
      await db.ingredient.delete({
        where: {
          id: ingredient.id
        }
      })
    }
    revalidatePath('/app/ingredients')
  }
}

// Recipes CRUD operations //

export async function getRecipes(userId: UserId): Promise<Recipe[]> {
  const data = await db.recipe.findMany({
    where: {
      userId: userId
    }
  });
  const recipes = JSON.parse(JSON.stringify(data));
  return recipes
}

export async function createRecipe(recipe : Recipe, recipeIngredientArray : Array<RecipeIngredient>) {

  const { user } = await validateRequest()
  if(user){
    recipe.userId = user.id;
    await db.recipe.create({
      data : {
        id: recipe.id,
        name: recipe.name,
        instructions: recipe.instructions,
        userId: user.id
      }
    })
    const data = recipeIngredientArray;
    await db.recipeIngredient.createMany({
      data
    })
    revalidatePath('/app/recipe')
  }
}

export async function deleteRecipe(recipe : Recipe) {
  const { user } = await validateRequest()
  if(user){
    if(user.id === recipe.userId){
      await db.recipe.delete({
        where: {
          id: recipe.id
        }
      })
    }
    revalidatePath('/app/recipe')
  }
}

// Recipe_Ingredients actions //

export async function getRecipeIngredients(recipe: Recipe) {
  const data = await db.recipeIngredient.findMany({
    where: {
      recipeId: recipe.id
    }
  });
  const recipeIngredient = JSON.parse(JSON.stringify(data));
  return recipeIngredient
}