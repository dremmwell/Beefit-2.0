"use client"

import { RecipeData, IngredientInRecipe } from '@/app/types/definitions'
import { getRecipeValues } from '@/lib/recipe_utils'
import React from 'react'
import { useState } from 'react';
import { RecipeValues } from '@/app/types/definitions';
import { convertTo100g } from '@/lib/recipe_utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, SquarePen, Trash2, ListCollapse } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Ingredient, Recipe, RecipeIngredient } from '@prisma/client'
import { Dialog } from "@/components/ui/dialog";
import RecipeEditForm from "./RecipeEditForm";
import DeleteDialog from "./DeleteDialog";
import DetailsDialog from "./DetailsDialog";
import IconMenu from "@/components/icon-menu";
import EditDialog from './EditDialog';


export default function RecipeCard( recipeData : any) {



  // Recipe Props are passed in a "nested" object (can't figure out why): recipeData = {recipe {... the recipe object}}, so the next line removes the outer "recipe" layer//
  const recipe = recipeData.recipe; 

  // Extract nutritional values of the Recipe //
  const recipeValues = getRecipeValues(recipe)

  // Converts recipes nutritional values between 100 grams and total weight and handles toggle //
  const [converted, setConverted] = useState(false);
  const convertedRecipeValues: RecipeValues = convertTo100g(recipeValues);

  // Handles Dioalog open/close state //
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>   

{/* Dialog Modals handled in the component */}
      <DetailsDialog 
      recipe={recipe}
      isOpen={isDetailsOpen}
      setIsOpen={setIsDetailsOpen}
      />

      <EditDialog 
        recipe={recipe}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
      />

      <DeleteDialog 
        recipe={recipe}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />

{/* Componenent Layout */}
      <Card className="shadow-md relative hover:shadow-xl duration-200 transition-all">
        <CardHeader >
              <CardTitle >
                  {recipe.name}
              </CardTitle>
              <CardDescription className="overflow-hidden">
                  {recipe.ingredients.slice(0,3).map((ingredient : IngredientInRecipe) => (
                      <a key = {ingredient.id}>{ingredient.ingredient.name}, </a>
                  ))} ...
              </CardDescription>
        </CardHeader>
          <CardContent>
              {converted ?
                <>
                  <div className="flex flex-wrap items-center space-x-2 mb-4">
                    <div>
                      <h1 className="text-sm text-muted-foreground">Calories</h1>
                      <h2 className="text-sm font-semibold">{convertedRecipeValues.calories} cal</h2>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <h1 className="text-sm text-muted-foreground">Proteins</h1>
                      <h2 className="text-sm font-semibold">{convertedRecipeValues.proteins} g</h2>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <h1 className="text-sm text-muted-foreground">Carbs</h1>
                      <h2 className="text-sm font-semibold">{convertedRecipeValues.carbs} g</h2>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <h1 className="text-sm text-muted-foreground">Fats</h1>
                      <h2 className="text-sm font-semibold">{convertedRecipeValues.fats} g</h2>
                    </div>
                  </div>
                  <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per 100g</span></h2>
              </>
              :
              <>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center space-x-2 mb-4">
                    <div>
                      <h1 className="text-sm text-muted-foreground">Calories</h1>
                      <h2 className="text-sm font-semibold">{recipeValues.calories} cal</h2>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <h1 className="text-sm text-muted-foreground">Proteins</h1>
                      <h2 className="text-sm font-semibold">{recipeValues.proteins} g</h2>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <h1 className="text-sm text-muted-foreground">Carbs</h1>
                      <h2 className="text-sm font-semibold">{recipeValues.carbs} g</h2>
                    </div>
                    <Separator orientation="vertical" />
                    <div>
                      <h1 className="text-sm text-muted-foreground">Fats</h1>
                      <h2 className="text-sm font-semibold">{recipeValues.fats} g</h2>
                    </div>
                  </div>
                  <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per recipe</span></h2>
                </div>
              </>
              }
                <div className="flex items-center mt-4 text-sm text-muted-foreground">
                  {converted ? 
                      <>
                          <Switch checked={converted} onCheckedChange={setConverted} />
                          <Label htmlFor="converted"className="ml-2">convert to recipe</Label>
                      </>
                      :
                      <>
                          <Switch checked={converted} onCheckedChange={setConverted} />
                          <Label htmlFor="converted"className="ml-2">convert to 100g</Label>
                      </>
                  } 
                  <div className="ml-auto">
                    <DropdownMenu modal={false}> {/* modal={false} prevents instantly closing dialog modals */}
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                          <button
                            onClick={() => {
                              setIsDetailsOpen(true);
                            }}
                            className="w-full justify-start flex rounded-md p-2"
                          >
                            <IconMenu
                              text="Details"
                              icon={<ListCollapse className="h-4 w-4" />}
                            />
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                          <button
                            onClick={() => {
                              setIsEditOpen(true);
                            }}
                            className="w-full justify-start flex rounded-md p-2"
                          >
                            <IconMenu
                              text="Edit"
                              icon={<SquarePen className="h-4 w-4" />}
                            />
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 focus:bg-destructive">
                          <button
                            onClick={() => {
                              setIsDeleteOpen(true);
                            }}
                            className="w-full justify-start flex rounded-md p-2"
                          >
                            <IconMenu
                              text="Delete"
                              icon={<Trash2 className="h-4 w-4" />}
                            />
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
          </CardContent>
      </Card>
    </>
  )
}
