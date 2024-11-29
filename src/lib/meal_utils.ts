//@ts-nocheck

import { MealData, RecipeAndIngredients, RecipeValues, TimeLineMeal, MealValues } from "@/app/types/definitions";
import { fractionToDecimal,convertRecipeFraction,convertTo100g, convertToGrams, getRecipeValues } from "./recipe_utils";
import { ArchivedMeal } from "@prisma/client";


export function getMealValues(meals : Array<MealData>){
    const mealsValues : Array<MealValues> = []

    meals.forEach((meal) => {
        const mealValues : MealValues = {
            calories: 0,
            proteins : 0,
            carbs: 0,
            fats: 0,
            description: "",
            userId: "",
            mealId: "",
            mealType: ""
        };
        mealValues.mealId = meal.id;
        mealValues.mealType = meal.mealType;
        mealValues.userId = meal.userId;
        for (let index = 0; index < meal.recipe.length; index++) {
            if(meal.recipe[index].unit == "grams"){
                const recipeValues : RecipeValues = convertToGrams(getRecipeValues(meal.recipe[index].recipe),meal.recipe[index].quantity);
/*                 mealValues.weight = recipeValues.weight; */
                mealValues.calories = recipeValues.calories;
                mealValues.proteins = recipeValues.proteins;
                mealValues.carbs = recipeValues.carbs;
                mealValues.fats = recipeValues.fats;
                mealValues.description = `${meal.recipe[index].quantity} grams of ${meal.recipe[index].recipe.name}`;
            }
            else{
                const ratio : number = meal.recipe[index].quantity * fractionToDecimal(meal.recipe[index].unit);
                const recipeValues : RecipeValues = convertRecipeFraction(getRecipeValues(meal.recipe[index].recipe), ratio);
/*                 mealValues.weight = recipeValues.weight; */
                mealValues.calories = recipeValues.calories;
                mealValues.proteins = recipeValues.proteins;
                mealValues.carbs = recipeValues.carbs;
                mealValues.fats = recipeValues.fats;
                mealValues.description = `${meal.recipe[index].quantity} portion(s) of ${meal.recipe[index].unit} recipe of ${meal.recipe[index].recipe.name}`
            }
        }
        for (let index = 0; index < meal.ingredients.length; index++) {
            if(meal.ingredients[index].unit === "grams"){
/*                 mealValues.weight += +meal.ingredients[index].quantity; */
                mealValues.calories += +meal.ingredients[index].ingredient.calories * meal.ingredients[index].quantity/ +meal.ingredients[index].ingredient.gramsPerUnit;
                mealValues.proteins += +meal.ingredients[index].ingredient.proteins * meal.ingredients[index].quantity/ +meal.ingredients[index].ingredient.gramsPerUnit;
                mealValues.carbs += +meal.ingredients[index].ingredient.carbs * meal.ingredients[index].quantity/ +meal.ingredients[index].ingredient.gramsPerUnit;
                mealValues.fats += +meal.ingredients[index].ingredient.fats * meal.ingredients[index].quantity/ +meal.ingredients[index].ingredient.gramsPerUnit;
                mealValues.description += `${meal.ingredients[index].quantity} ${meal.ingredients[index].unit} of ${meal.ingredients[index].ingredient.name} \n` 
            }
            else{
/*                 mealValues.weight += +meal.ingredients[index].quantity* +meal.ingredients[index].ingredient.gramsPerUnit; */
                mealValues.calories += +meal.ingredients[index].ingredient.calories * meal.ingredients[index].quantity;
                mealValues.proteins += +meal.ingredients[index].ingredient.proteins * meal.ingredients[index].quantity;
                mealValues.carbs += +meal.ingredients[index].ingredient.carbs * meal.ingredients[index].quantity;
                mealValues.fats += +meal.ingredients[index].ingredient.fats * meal.ingredients[index].quantity;
                mealValues.description += `${meal.ingredients[index].quantity} ${meal.ingredients[index].unit}(s) of ${meal.ingredients[index].ingredient.name} \n` 
            }
        }
        mealsValues.push(mealValues);
    })
    return mealsValues
}

export function getArchivedMealsValues(archivedMeals : ArchivedMeal[]){
    const mealsValues : Array<MealValues> = []

    archivedMeals.forEach((meal) => {
        const mealValues : MealValues = {
            calories: 0,
            proteins : 0,
            carbs: 0,
            fats: 0,
            description: "",
            userId: "",
            mealId: "",
            mealType: ""
        };
        mealValues.mealId = meal.id;
        mealValues.description = `${meal.description} \n`
        mealValues.mealType = meal.mealType;
        mealValues.calories = meal.calories;
        mealValues.proteins = meal.proteins;
        mealValues.carbs = meal.carbs;
        mealValues.fats = meal.fats;
        mealValues.userId = meal.userId;

        mealsValues.push(mealValues);
    })
    return mealsValues
}

export function sumMealValues(mealArray: MealValues[]) {
    let totalMeal : MealValues = {
        mealId: "",
        mealType: "",    
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,   
        description: "",
        userId :"",
    }

    mealArray.forEach(meal => {
        totalMeal.calories += meal.calories;
        totalMeal.proteins += meal.proteins;
        totalMeal.carbs += meal.carbs;
        totalMeal.fats += meal.fats;
        totalMeal.userId = meal.userId
    });

    return totalMeal;
}