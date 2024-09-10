import { RecipeData, RecipeValues } from "@/app/types/definitions";

export function getRecipeValues(recipe: RecipeData) {

    // Sums the nutritional values of each ingredient normalized to 100g //

    let weight : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        weight += +recipe.ingredients[i].grams;
    }

    let calories : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        calories += (+recipe.ingredients[i].ingredient.calories*100/ +recipe.ingredients[i].ingredient.gramsPerUnit)* +recipe.ingredients[i].grams/100;
    }

    let proteins : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        proteins += (+recipe.ingredients[i].ingredient.proteins*100/ +recipe.ingredients[i].ingredient.gramsPerUnit)* +recipe.ingredients[i].grams/100;
    }

    let carbs : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        carbs += (+recipe.ingredients[i].ingredient.carbs*100/ +recipe.ingredients[i].ingredient.gramsPerUnit)* +recipe.ingredients[i].grams/100;
    }

    let fats : number = 0;
    for (let i = 0; i < recipe.ingredients.length; i++) {
        fats += (+recipe.ingredients[i].ingredient.fats*100/ +recipe.ingredients[i].ingredient.gramsPerUnit)* +recipe.ingredients[i].grams/100;
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