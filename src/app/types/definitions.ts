import { Ingredient, Recipe, RecipeIngredient, Meal, Objective, ExerciceGroup, ExercicePerfs } from "@prisma/client";
import { Labels } from "@prisma/client";

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
    mealId: string,
    userId: string,
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
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;   
    description: string ;
    userId : string;
    createdAt : Date;
}

export type DayData = {
    date : Date,
    objective : Objective,
    color : string,
    mealsValues : MealValues[]
}

export type StreakData = {
    title : string,
    value : number,
    footer : string
}

export type FocusLabels = {
  id: string
  name: string
  createdAt: Date,
  userId: string,
  priority: string
  labels: Array<Labels>
}


export type ExerciceData = {
    id: string,
    name: string,
    groupOrder: number,
    userId: string,
    description: string,
    createdAt: Date,
    exerciceGroupId: string,
    execiceLabels: LabelExercices[],
    LabelsExercice?: LabelExercices[],
    exercicePerfs: ExercicePerfs[],
}

export type ExercicePerfInput = {
    sets: number,
    reps: number,
    weight: number,
    notes: string,
}

export type LabelExercices = {
    id : string,
    createdAt: Date,
    value: string,
    labelId: string,
    exerciceId: string,
    Labels: Labels,
    labels?: Labels,
}