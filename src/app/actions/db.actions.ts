"use server"

import db from "@/db/db";
import { Ingredient, Recipe, RecipeIngredient, MealIngredient, Meal, MealRecipe } from '@prisma/client';
import { RecipeAndIngredients } from "../types/definitions";
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

//----------------------------------------- Ingredients CRUD operations ------------------------------------//

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
  return
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
    return
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
  return
}

//----------------------------------------- Recipes CRUD operations ---------------------------------//

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

//----------------------------------------- Meal CRUD operations -----------------------------------------//

export async function getMealsByDate(userId: UserId, date : Date) {

  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)

  const data = await db.meal.findMany({
    where: {
      userId: userId,
      createdAt: {
        gte: startDate.toISOString(),
        lt: endDate.toISOString()
      }
    },
    include: {
      recipe : {
        include : {
          recipe: {
            include : {
              ingredients : {
                include : {
                  ingredient :true
                }
              }
            }
          }
        }
      },
      ingredients: {
        include : {
          ingredient : true
        }
      }
    },
    orderBy: { createdAt: 'desc' } 
  })
  const meals = JSON.parse(JSON.stringify(data));
  return meals
}

export async function createMealFromIngredients (meal : Meal, ingredients : Array<MealIngredient>){
  const { user } = await validateRequest()
  if(user){
    await db.meal.create({
      data : {
        id : meal.id,
        mealType : meal.mealType,
        userId : user.id,
        createdAt : meal.createdAt,
        updatedAt: meal.updatedAt,
      }
    })
    const data = ingredients;
    await db.mealIngredient.createMany({
      data
    })
    revalidatePath('/app/date')
  }
  return
}

export async function createMealFromRecipe(meal: Meal, mealRecipe : Array<MealRecipe>) {
  const { user } = await validateRequest()
  if(user){
    await db.meal.create({
      data : {
        id : meal.id,
        mealType : meal.mealType,
        userId : user.id,
        createdAt : meal.createdAt,
        updatedAt : meal.updatedAt,
      }
    })
    const data = mealRecipe;
    await db.mealRecipe.createMany({
      data
    })
    revalidatePath('/app/date')
  }
  return
}

export async function deleteMeal(mealId : string) {
  const { user } = await validateRequest()
  if(user){
    const mealIdArray : Array<string> = mealId.split('/') 
      await db.meal.deleteMany({
        where: {
          id: {
              in: mealIdArray
          }
        }
      })
    revalidatePath('/app/today')
  }
  return
}