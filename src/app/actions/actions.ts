"use server"

 import db from "@/db/db";
 import { Ingredient } from "@/lib/definitions";

export async function getIngredients() {
    const data = await db.ingredient.findMany();
    const ingredients = JSON.parse(JSON.stringify(data));
    return ingredients
}

export async function createIngredient(ingredient: Ingredient) {

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
        fats: ingredient.fats
      }
    })
}
  
export async function deleteIngredient(ingredient: Ingredient) {
    console.log(ingredient.name)
}

