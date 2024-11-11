//@ts-nocheck

import { description } from "@/app/app/today/CaloriesChart";
import { MealData, RecipeAndIngredients, RecipeValues, TimeLineMeal, MealValues } from "@/app/types/definitions";
import { Ingredient, Meal } from "@prisma/client";

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

export function getMealValues(meals : Array<MealData>){
    const mealsValues : Array<MealValues> = []

    meals.forEach((meal) => {
        const mealValues : MealValues = {};
        mealValues.mealId = meal.id;
        mealValues.mealType = meal.mealType;
        for (let index = 0; index < meal.recipe.length; index++) {
            if(meal.recipe[index].unit == "grams"){
                const recipeValues : RecipeValues = convertToGrams(getRecipeValues(meal.recipe[index].recipe),meal.recipe[index].quantity);
                mealValues.weight = recipeValues.weight;
                mealValues.calories = recipeValues.calories;
                mealValues.proteins = recipeValues.proteins;
                mealValues.carbs = recipeValues.carbs;
                mealValues.fats = recipeValues.fats;
                mealValues.description = `${meal.recipe[index].quantity} grams of ${meal.recipe[index].recipe.name}`;
            }
            else{
                const ratio : number = meal.recipe[index].quantity * fractionToDecimal(meal.recipe[index].unit);
                const recipeValues : RecipeValues = convertRecipeFraction(getRecipeValues(meal.recipe[index].recipe), ratio);
                mealValues.weight = recipeValues.weight;
                mealValues.calories = recipeValues.calories.toFixed(0);
                mealValues.proteins = recipeValues.proteins;
                mealValues.carbs = recipeValues.carbs;
                mealValues.fats = recipeValues.fats;
                mealValues.description = `${meal.recipe[index].quantity} portion(s) of ${meal.recipe[index].unit} recipe(s) of ${meal.recipe[index].recipe.name}`
            }
        }
        mealsValues.push(mealValues);
    })
    return mealsValues
}

export function getTimelineMealsGrouped(meals : Array<Meal>) {
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

export function convertToGrams(recipeValues: RecipeValues, grams: number){
    
    const ratio = grams/recipeValues.weight;

    const convertedRecipeValues: RecipeValues = {
        recipeId: recipeValues.recipeId,
        weight: ratio*grams,
        calories: parseFloat((recipeValues.calories * ratio).toFixed(1)),
        proteins: parseFloat((recipeValues.proteins * ratio).toFixed(1)),
        carbs: parseFloat((recipeValues.carbs * ratio).toFixed(1)),
        fats: parseFloat((recipeValues.fats * ratio).toFixed(1)),
    }
    return convertedRecipeValues
}

export function convertRecipeFraction(recipeValues: RecipeValues, ratio : number){
  
    const convertedRecipeValues: RecipeValues = {
        recipeId: recipeValues.recipeId,
        weight: parseFloat((recipeValues.weight * ratio).toFixed(1)),
        calories: parseFloat((recipeValues.calories * ratio).toFixed(1)),
        proteins: parseFloat((recipeValues.proteins * ratio).toFixed(1)),
        carbs: parseFloat((recipeValues.carbs * ratio).toFixed(1)),
        fats: parseFloat((recipeValues.fats * ratio).toFixed(1)),
    }
    return convertedRecipeValues
}

function fractionToDecimal(fraction : string) {
    return fraction
      .split('/')
      .reduce((numerator, denominator, i) =>
        numerator / (i ? denominator : 1)
      );
  }