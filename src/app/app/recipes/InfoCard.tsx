"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Ingredient, Recipe, RecipeIngredient } from '@prisma/client'
import { useState } from 'react'   
import { convertTo100g, getRecipeValues } from '@/lib/recipe_utils'
import { IngredientInRecipe, RecipeValues } from '@/app/types/definitions';

interface InfoCardProps {
    recipe: Recipe,
    ingredientsInRecipe: Array<IngredientInRecipe>
}

export default function InfoCard({recipe, ingredientsInRecipe}: InfoCardProps) {

    const [converted, setConverted] = useState(false);

    const recipeValues = getRecipeValues(recipe, ingredientsInRecipe);

    const convertedRecipeValues: RecipeValues = convertTo100g(recipeValues);


  return (
    <Card className="w-[500px]">
       <CardHeader >
        <h2 className="">{recipe.name}</h2>
        <h2 className="">Weight: {recipeValues.weight}</h2>
       </CardHeader>
        <CardContent>
            {converted ?
              <>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center space-x-4 text-sm mt-8 mb-8">
                  <div>
                    <h1 className="text-lg text-muted-foreground">Calories</h1>
                    <h2 className="text-lg font-semibold">{convertedRecipeValues.calories} cal</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Proteins</h1>
                    <h2 className="text-lg font-semibold">{convertedRecipeValues.proteins} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Carbs</h1>
                    <h2 className="text-lg font-semibold">{convertedRecipeValues.carbs} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Fats</h1>
                    <h2 className="text-lg font-semibold">{convertedRecipeValues.fats} g</h2>
                  </div>
                </div>
                <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per 100g</span></h2>
              </div>
            </>
            :
            <>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center space-x-4 text-sm mt-8 mb-8">
                  <div>
                    <h1 className="text-lg text-muted-foreground">Calories</h1>
                    <h2 className="text-lg font-semibold">{recipeValues.calories} cal</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Proteins</h1>
                    <h2 className="text-lg font-semibold">{recipeValues.proteins} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Carbs</h1>
                    <h2 className="text-lg font-semibold">{recipeValues.carbs} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Fats</h1>
                    <h2 className="text-lg font-semibold">{recipeValues.fats} g</h2>
                  </div>
                </div>
                <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per recipe</span></h2>
              </div>
            </>
            }
              <div className="flex items-center space-x-2 mt-4 text-muted-foreground">
                {converted ? 
                    <>
                        <Switch checked={converted} onCheckedChange={setConverted} />
                        <Label htmlFor="converted">convert for recipe</Label>
                    </>
                    :
                    <>
                        <Switch checked={converted} onCheckedChange={setConverted} />
                        <Label htmlFor="converted">convert for 100g</Label>
                    </>
                } 
              </div>
        </CardContent>
    </Card>
  )
}
