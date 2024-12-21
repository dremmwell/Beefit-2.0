"use server"

import db from "@/db/db";
import { Ingredient, Recipe, RecipeIngredient, MealIngredient, Meal, MealRecipe, Objective, ArchivedMeal } from '@prisma/client';
import { RecipeAndIngredients } from "../../types/definitions";
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

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
  
  export async function getArchivedMealsByPeriod(userId: UserId, startDate : Date, endDate : Date){
    
    const archivedData = await db.archivedMeal.findMany({
      where : {
        userId: userId,
        createdAt: {
          gte: startDate.toISOString(),
          lt: endDate.toISOString()
        }
      }
    })
    const archivedMeals = JSON.parse(JSON.stringify(archivedData));
    return archivedMeals
  }
  
  export async function getMealsByPeriod(userId: UserId, startDate : Date, endDate : Date) {
  
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
      revalidatePath('/app/today')
      revalidatePath('/app/overview')
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
      revalidatePath('/app/today')
      revalidatePath('/app/overview')
    }
    return
  }
  
  export async function createCustomMeal(meal : ArchivedMeal){
  
    const { user } = await validateRequest()
    if(user){
      await db.archivedMeal.create({
        data : {
          id : meal.id,
          description : meal.description,
          mealType : meal.mealType,
          calories: meal.calories,
          proteins: meal.proteins,
          carbs : meal.carbs,
          fats : meal.fats,
          createdAt : meal.createdAt,
          userId : user.id,
        }
      })
      revalidatePath('/app/today')
      revalidatePath('/app/overview')
    }
    return
  }
  
  export async function deleteMeal(mealId : string, userId: string) {
    const { user } = await validateRequest()
    if(user){
      if(user.id === userId){
        const mealIdArray : Array<string> = mealId.split('/') 
          await db.meal.deleteMany({
            where: {
              id: {
                  in: mealIdArray
              }
            }
          })
          await db.archivedMeal.deleteMany({
            where: {
              id: {
                  in: mealIdArray
              }
            }
          })
        revalidatePath('/app/today')
      }
    }
    return
  }