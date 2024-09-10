import { Ingredient, Recipe, RecipeIngredient } from "@prisma/client";
import { LargeNumberLike } from "crypto";

export type RecipeValues = {
    recipeId: string;
    weight: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export type RecipeData = {
    id: string;
    name: string;
    bookmarked: boolean;
    instructions: string;
    createdAt: number;
    updatedAt: number;
    userId: string;
    ingredients: Array<IngredientInRecipe>;
}

export type IngredientInRecipe = {
    id: string;
    recipeId: string;
    ingredientId: string;
    grams: string;
    createdAt: number;
    updatedAt: number;
    ingredient: Ingredient;
}