"use server"

import db from "@/db/db"
import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()
import { Ingredient } from "@/lib/definitions"

export async function seedIngredients() {
    await db.ingredient.create({

    })
}

