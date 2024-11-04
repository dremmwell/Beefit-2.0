//@ts-nocheck

import { RecipeAndIngredients, RecipeValues } from "@/app/types/definitions";

export function getRecipeValues(recipe: RecipeAndIngredients) {

    // Sums the nutritional values of each ingredient normalized to 100g //

    let weight : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if(recipe.ingredients[i].unit === "grams"){
            weight += +recipe.ingredients[i].quantity;
        }
        else{
            weight += +recipe.ingredients[i].quantity* +recipe.ingredients[i].ingredient.gramsPerUnit
        }
    }

    let calories : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if(recipe.ingredients[i].unit === "grams"){
            calories += +recipe.ingredients[i].ingredient.calories*recipe.ingredients[i].quantity/ +recipe.ingredients[i].ingredient.gramsPerUnit       
        }
        else{
            calories += +recipe.ingredients[i].ingredient.calories*recipe.ingredients[i].quantity
        }
    }

    let proteins : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if(recipe.ingredients[i].unit === "grams"){
            proteins += +recipe.ingredients[i].ingredient.proteins*recipe.ingredients[i].quantity/ +recipe.ingredients[i].ingredient.gramsPerUnit       
        }
        else{
            proteins += +recipe.ingredients[i].ingredient.proteins*recipe.ingredients[i].quantity
        }
    }

    let carbs : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if(recipe.ingredients[i].unit === "grams"){
            carbs += +recipe.ingredients[i].ingredient.carbs*recipe.ingredients[i].quantity/ +recipe.ingredients[i].ingredient.gramsPerUnit       
        }
        else{
            carbs += +recipe.ingredients[i].ingredient.carbs*recipe.ingredients[i].quantity
        }
    }

    let fats : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        if(recipe.ingredients[i].unit === "grams"){
            fats += +recipe.ingredients[i].ingredient.fats*recipe.ingredients[i].quantity/ +recipe.ingredients[i].ingredient.gramsPerUnit       
        }
        else{
            fats += +recipe.ingredients[i].ingredient.fats*recipe.ingredients[i].quantity
        }
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