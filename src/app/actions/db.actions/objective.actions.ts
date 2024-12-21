"use server"

import db from "@/db/db";
import { Ingredient, Recipe, RecipeIngredient, MealIngredient, Meal, MealRecipe, Objective, ArchivedMeal } from '@prisma/client';
import { RecipeAndIngredients } from "../../types/definitions";
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

export async function getLatestObjective(userId : UserId){
    const data = await db.objective.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    })
    const objective = JSON.parse(JSON.stringify(data[0]));
    return objective
  }
  
  export async function getObjectives(userId : UserId){
    const data = await db.objective.findMany({
      where : {
        userId: userId,
      }
    })
    const objectives = JSON.parse(JSON.stringify(data));
    return objectives
  }
  
  export async function getObjectiveByPeriod(userId : UserId, startDate : Date, endDate : Date){
  
    const data = await db.objective.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate.toISOString(),
          lt: endDate.toISOString()
        }
      },
      orderBy: { createdAt: 'desc' } 
    })
    const objective = JSON.parse(JSON.stringify(data));
    return objective
  }
  
  export async function updateOrCreateObjective(objective : Objective) {
    const { user } = await validateRequest()
  
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    // Find the record for today's date
    if(user){
      const existingRecord = await db.objective.findMany({
        where: {
          userId: user?.id,
          createdAt: {
            gte: startDate.toISOString(),
            lt: endDate.toISOString()
          }
        },
        orderBy: { createdAt: 'desc' } 
      });
      if (existingRecord[0]) {
        // Update the record if it exists
        await db.objective.update({
          where: { id: existingRecord[0].id },
          data: {
            calories: objective.calories,
            proteins: objective.proteins,
            carbs: objective.carbs,
            fats: objective.fats,
            userId: user.id,
          },
        });
      } else {
        // Create a new record if no existing one is found
        await db.objective.create({
          data: {
            calories: objective.calories,
            proteins: objective.proteins,
            carbs: objective.carbs,
            fats: objective.fats,
            userId: user.id,
          },
        });
      }
      revalidatePath('/app/objectives')
    }
  }