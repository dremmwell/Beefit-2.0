"use server"

import db from "@/db/db";
import { Ingredient } from "@/lib/definitions";
import { User, UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'
import { date } from "zod";

export async function getIngredients(userId: UserId) {
    const data = await db.ingredient.findMany({
      where: {
        userId: userId
      }
    }

    );
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

