"use server"

import React from 'react'
import RecipeCard from "./RecipeCard";
import { RecipeAndIngredients } from "@/app/types/definitions";
import { User } from "lucia";
import { getIngredients } from "@/app/actions/db.actions/ingredient.actions";
import { getRecipesAndIngredients } from "@/app/actions/db.actions/recipe.actions";
import { Ingredient } from "@prisma/client";

async function RecipeGrid(
    {
        searchParams, user
      }: {
        searchParams: { [key: string]: string | string[] | undefined }, user : User
      }
) {

    const recipes :Array<RecipeAndIngredients> = await getRecipesAndIngredients(user.id);
    const ingredients :Array<Ingredient> = await getIngredients(user.id);

    // Page prop "searchParams" gets search param in the url //
    const search = typeof searchParams.search === 'string' ? searchParams.search : undefined

    const filteredRecipes = recipes.filter((recipe : RecipeAndIngredients) => {
    if (!recipe || !recipe.name) return false;
    if (!search) return recipes;
    const lowerCaseName = recipe.name.toLowerCase();
    const lowerCaseSearchTerm = search.toLowerCase();
    return lowerCaseName.includes(lowerCaseSearchTerm);
    });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-scroll no-scrollbar">
        {filteredRecipes.map((recipe: RecipeAndIngredients) => (
            <RecipeCard key={recipe.id} recipe={recipe} ingredients={ingredients}/>
        ))}
    </div>
  )
}

export default RecipeGrid
