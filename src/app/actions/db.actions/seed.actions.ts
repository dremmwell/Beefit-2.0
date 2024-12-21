"use server"

import db from "@/db/db";
import { Ingredient, Recipe, RecipeIngredient, MealIngredient, Meal, MealRecipe, Objective, ArchivedMeal } from '@prisma/client';
import { createIngredient } from "./ingredient.actions";
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

//----------------------------------------- Seeding Database ------------------------------------//

export async function seedDB(userId : UserId){
  await db.objective.create({
    data : {
      userId : userId
    }
  })
}

export async function seedIngredients(userId : UserId, ingredients : any){
  ingredients.forEach((ingredient : any) => {
    createIngredient(ingredient)
  });
}