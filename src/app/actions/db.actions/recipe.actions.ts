"use server"

import db from "@/db/db";
import { Ingredient, Recipe, RecipeIngredient, MealIngredient, Meal, MealRecipe, Objective, ArchivedMeal } from '@prisma/client';
import { RecipeAndIngredients } from "../../types/definitions";
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

export async function getRecipesAndIngredients(userId : UserId) {

    const data = await db.recipe.findMany({
      where: {
        userId: userId,
        isOriginal: true
      },
      include:{
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });
    const recipes : Array<RecipeAndIngredients> = JSON.parse(JSON.stringify(data));
    return recipes
  }
  
  export async function getVariantRecipesAndIngredients(userId : UserId) {
  
    const date = new Date();
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1)
  
    const data = await db.recipe.findMany({
      where: {
        userId: userId,
        isOriginal: false,
        createdAt: {
          gte: startDate.toISOString(),
          lt: endDate.toISOString()
        }
      },
      include:{
        ingredients: {
          include: {
            ingredient: true
          }
        }
      }
    });
    const recipes : Array<RecipeAndIngredients> = JSON.parse(JSON.stringify(data));
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
          userId: user.id,
          bookmarked: recipe.bookmarked,
          isOriginal: recipe.isOriginal,
        }
      })
      const data = recipeIngredientArray;
      await db.recipeIngredient.createMany({
        data
      })
      revalidatePath('/app/recipe')
    }
    return
  }
  
  export async function updateRecipe(recipe : Recipe, recipeIngredientArray : Array<RecipeIngredient>) {
    const { user } = await validateRequest()
    if(user){
      recipe.userId = user.id;
      await db.recipe.update({
        where : {
          id: recipe.id
        },
        data : {
          id: recipe.id,
          name: recipe.name,
          instructions: recipe.instructions,
          userId: user.id
        }
      })
      const data = recipeIngredientArray;
      await db.recipeIngredient.deleteMany({
        where : {
          recipeId: recipe.id
        }
      });
      await db.recipeIngredient.createMany({
        data
      })
      revalidatePath('/app/recipe')
    }
    return
  }
  
  export async function deleteRecipe(recipeId : string, userId: string) {
    const { user } = await validateRequest()
    if(user){
      if(user.id === userId){
        await db.recipe.delete({
          where: {
            id: recipeId
          }
        })
      }
      revalidatePath('/app/recipe')
    }
    return
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
  