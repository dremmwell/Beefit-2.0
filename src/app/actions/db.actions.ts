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

export async function deleteRecipe(recipeId: string) {
  console.log(`Recipe ID : ${recipeId} to be deleted`)
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