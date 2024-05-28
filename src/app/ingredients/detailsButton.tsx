'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ingredient } from "@/lib/definitions"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { convertTo100g } from "@/lib/ingredients_utils"

interface DetailsButtonProps {
    ingredient: Ingredient,
}
   
  export function DetailsButton({ingredient}: DetailsButtonProps) {

    const [converted, setConverted] = useState(false);
    const convertedIngredient: Ingredient = convertTo100g(ingredient);

    return (
      <Dialog >
        <DialogTrigger asChild>
          <Button className="self-start" variant="ghost">Details</Button>
        </DialogTrigger>
        <DialogContent className="rounded-[0.5rem]">
          <div>
          {ingredient.per === "100g" ?   
            <>
              <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-3">{ingredient.name}</h2>
              <div className="space-y-4">
                <div className="flex h-5 items-center space-x-4 text-sm mt-8 mb-8">
                  <div>
                    <h1 className="text-lg text-muted-foreground">Calories</h1>
                    <h2 className="text-lg font-semibold">{ingredient.calories} cal</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Proteins</h1>
                    <h2 className="text-lg font-semibold">{ingredient.proteins} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Carbs</h1>
                    <h2 className="text-lg font-semibold">{ingredient.carbs} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Fats</h1>
                    <h2 className="text-lg font-semibold">{ingredient.fats} g</h2>
                  </div>
                </div>
                <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per 100g</span></h2>
                
              </div>
            </>
            :
            <>
            <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-1">{ingredient.name}</h2>
            <h2 className="text-muted-foreground border-b pb-2">One {ingredient.per} of {ingredient.name} weights {ingredient.gperitem} grams</h2>
            {converted ?
              <>
              <div className="space-y-4">
                <div className="flex h-5 items-center space-x-4 text-sm mt-8 mb-8">
                  <div>
                    <h1 className="text-lg text-muted-foreground">Calories</h1>
                    <h2 className="text-lg font-semibold">{convertedIngredient.calories} cal</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Proteins</h1>
                    <h2 className="text-lg font-semibold">{convertedIngredient.proteins} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Carbs</h1>
                    <h2 className="text-lg font-semibold">{convertedIngredient.carbs} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Fats</h1>
                    <h2 className="text-lg font-semibold">{convertedIngredient.fats} g</h2>
                  </div>
                </div>
                <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per 100g</span></h2>
              </div>
            </>
            :
            <>
              <div className="space-y-4">
                <div className="flex h-5 items-center space-x-4 text-sm mt-8 mb-8">
                  <div>
                    <h1 className="text-lg text-muted-foreground">Calories</h1>
                    <h2 className="text-lg font-semibold">{ingredient.calories} cal</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Proteins</h1>
                    <h2 className="text-lg font-semibold">{ingredient.proteins} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Carbs</h1>
                    <h2 className="text-lg font-semibold">{ingredient.carbs} g</h2>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <h1 className="text-lg text-muted-foreground">Fats</h1>
                    <h2 className="text-lg font-semibold">{ingredient.fats} g</h2>
                  </div>
                </div>
                <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per {ingredient.per}</span></h2>
              </div>
            </>
            }
              <div className="flex items-center space-x-2 mt-4 text-muted-foreground">
                <Switch checked={converted} onCheckedChange={setConverted} />
                <Label htmlFor="converted">convert for 100g</Label>
              </div>
            </>
          }
          </div>
        </DialogContent>
      </Dialog>
    )
  }