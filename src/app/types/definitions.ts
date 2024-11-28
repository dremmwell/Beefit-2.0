import { Ingredient, Recipe, RecipeIngredient, Meal } from "@prisma/client";

export type RecipeValues = {
    recipeId: string;
    weight: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export type RecipeAndIngredients = {
    id: string;
    name: string;
    bookmarked: boolean;
    instructions: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    isOriginal: boolean
    ingredients: Array<RecipeIngredient>;
}

export type IngredientInRecipe = {
    id: string;
    recipeId: string;
    ingredientId: string;
    quantity: number;
    unit: string;
    createdAt: Date;
    updatedAt: Date;
    ingredient: Ingredient;
}

export type TimeLineMeal = {
    title: string,
    calories: number,
    description: string,
    mealId: string
}

export type MealData = {
    id : string
    mealType : string
    createdAt : string
    updatedAt : string
    userId : string
    recipe : Array<RecipeAndIngredients>,
    ingredient : Array<IngredientInRecipe>,
}

export type MealValues = {
    mealId: string,
    mealType: string,    
    weight: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;   
    description: string ;
}