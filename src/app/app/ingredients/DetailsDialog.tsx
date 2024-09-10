import React, { Dispatch, SetStateAction } from 'react';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Ingredient } from '@prisma/client'
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { convertTo100g } from "@/lib/ingredients_utils"
import IconMenu from '@/components/icon-menu';
import { Trash2, ListCollapse } from 'lucide-react';

interface DetailsDialogProps {
    ingredient: Ingredient,
}
   
export default function DetailsDialog({
  ingredient,
  isOpen,
  setIsOpen
}: {
  ingredient: Ingredient
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

    const [converted, setConverted] = useState(false);
    const convertedIngredient: Ingredient = convertTo100g(ingredient);

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-[0.5rem]">
          <div className="flex flex-col">
          {ingredient.unit === "100g" ?   
            <>
              <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-3">{ingredient.name}</h2>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center space-x-4 text-sm mt-8 mb-8">
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
            <h2 className="text-muted-foreground border-b pb-2">One {ingredient.unit} of {ingredient.name} weights {ingredient.gramsPerUnit} grams</h2>
            {converted ?
              <>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center space-x-4 text-sm mt-8 mb-8">
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
                <div className="flex flex-wrap items-center space-x-4 text-sm mt-8 mb-8">
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
                <h2 className="text-sm text-muted-foreground">Nutritional information <span className="text-foreground font-semibold">per {ingredient.unit}</span></h2>
              </div>
            </>
            }
              <div className="flex items-center space-x-2 mt-4 text-muted-foreground">
                {converted ? 
                    <>
                        <Switch checked={converted} onCheckedChange={setConverted} />
                        <Label htmlFor="converted">convert for {ingredient.unit}</Label>
                    </>
                    :
                    <>
                        <Switch checked={converted} onCheckedChange={setConverted} />
                        <Label htmlFor="converted">convert for 100g</Label>
                    </>
                } 
              </div>
            </>
          }
          </div>
        </DialogContent>
      </Dialog>
    )
  }