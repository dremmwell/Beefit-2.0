import { LargeNumberLike } from "crypto";

export type RecipeValues = {
    recipeId: string;
    weight: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
}

export type IngredientInRecipe = {
    id: string;
    name: string;
    unit: string;
    gramsPerUnit: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    userId: string;
    bookmarked: boolean;
    createdAt: number;
    updatedAt: number;
    gramsInRecipe: number
};