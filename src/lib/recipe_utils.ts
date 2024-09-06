import { IngredientInRecipe, RecipeValues } from "@/app/types/definitions";
import { Recipe } from "@prisma/client";

export function getRecipeValues(recipe: Recipe, ingredientsInRecipe: Array<IngredientInRecipe>) {

    // Sums the nutritional values of each ingredient normalized to 100g //

    let weight : number = 0;
    for (let i = 0; i < ingredientsInRecipe.length; i++) {
        weight += +ingredientsInRecipe[i].gramsInRecipe;
    }

    let calories : number = 0;
    for (let i = 0; i < ingredientsInRecipe.length; i++) {
        calories += (+ingredientsInRecipe[i].calories*100/ +ingredientsInRecipe[i].gramsPerUnit)* +ingredientsInRecipe[i].gramsInRecipe/100;
    }

    let proteins : number = 0;
    for (let i = 0; i < ingredientsInRecipe.length; i++) {
        proteins += (+ingredientsInRecipe[i].proteins*100/ +ingredientsInRecipe[i].gramsPerUnit)* +ingredientsInRecipe[i].gramsInRecipe/100;
    }

    let carbs : number = 0;
    for (let i = 0; i < ingredientsInRecipe.length; i++) {
        carbs += (+ingredientsInRecipe[i].carbs*100/ +ingredientsInRecipe[i].gramsPerUnit)* +ingredientsInRecipe[i].gramsInRecipe/100;
    }

    let fats : number = 0;
    for (let i = 0; i < ingredientsInRecipe.length; i++) {
        fats += (+ingredientsInRecipe[i].fats*100/ +ingredientsInRecipe[i].gramsPerUnit)* +ingredientsInRecipe[i].gramsInRecipe/100;
    }

    // Returns the nutritional values of the recipe //

    const recipeValues: RecipeValues = {
        recipeId: recipe.id,
        weight: parseFloat(weight.toFixed(1)),
        calories: parseFloat(calories.toFixed(1)),
        proteins: parseFloat(proteins.toFixed(1)),
        carbs: parseFloat(carbs.toFixed(1)),
        fats: parseFloat(fats.toFixed(1)),
    }

    return recipeValues
}


export function convertTo100g(recipeValues: RecipeValues){
    
    const ratio = 100/recipeValues.weight;

    const convertedRecipeValues: RecipeValues = {
        recipeId: recipeValues.recipeId,
        weight: ratio*100,
        calories: parseFloat((recipeValues.calories * ratio).toFixed(1)),
        proteins: parseFloat((recipeValues.proteins * ratio).toFixed(1)),
        carbs: parseFloat((recipeValues.carbs * ratio).toFixed(1)),
        fats: parseFloat((recipeValues.fats * ratio).toFixed(1)),
    }
    return convertedRecipeValues
}