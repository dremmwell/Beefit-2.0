"use client"

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
import { useState } from 'react'   
import { convertTo100g, getRecipeValues } from '@/lib/recipe_utils'
import { IngredientInRecipe, RecipeValues } from '@/app/types/definitions';
import { Dialog } from "@/components/ui/dialog";
import RecipeEditForm from "./RecipeEditForm";
import DeleteDialog from "./DeleteDialog";
import DetailsDialog from "./DetailsDialog";
import IconMenu from "@/components/icon-menu";

interface InfoCardProps {
    recipe: Recipe,
    ingredientsInRecipe: Array<IngredientInRecipe>
}

export default function InfoCard({recipe, ingredientsInRecipe}: InfoCardProps) {

    const recipeValues = getRecipeValues(recipe, ingredientsInRecipe);

    const [converted, setConverted] = useState(false);
    const convertedRecipeValues: RecipeValues = convertTo100g(recipeValues);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
{/* Dialogs open/close and props setup */}  
      <DeleteDialog 
        recipeId={recipe.id}
        recipeName={recipe.name}
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
      />

{/* InfoCard layout */}      
      <Card >
        <CardHeader >
              <CardTitle >
                  {recipe.name}
              </CardTitle>
              <CardDescription className="overflow-hidden">
                  {ingredientsInRecipe.slice(0,3).map(ingredientInRecipe => (
                      <>{ingredientInRecipe.name}, </>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] z-50">
                        <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
                          <button
                            onClick={() => {
                              setIsEditOpen(true);
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
