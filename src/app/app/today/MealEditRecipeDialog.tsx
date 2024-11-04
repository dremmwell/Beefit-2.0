import React, { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Recipe, Ingredient } from '@prisma/client';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import MealEditRecipeForm from './MealEditRecipeForm';
import { columnsIngredients } from "./columns"
import { ScrollArea } from '@/components/ui/scroll-area';
import { RecipeAndIngredients } from '@/app/types/definitions';

export default function MealEditRecipeDialog({
  recipe,
  ingredients,
  onEdit
}: {
  recipe : RecipeAndIngredients,
  ingredients : Array<Ingredient>,
  onEdit : Function
}) {

    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handlesSave = (recipe : RecipeAndIngredients) => {
        onEdit(recipe)
        setOpen(false)
      }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button >Edit Recipe</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit min-h-[620px] flex-1">
          <DialogHeader >
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>
              Edit your recipe for today only !
            </DialogDescription>
          </DialogHeader>
          <MealEditRecipeForm columns={columnsIngredients} data={ingredients} onSave={handlesSave} recipe={recipe}/>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button >Edit Recipe</Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit max-h-full flex-1">
        <DialogHeader >
          <DialogTitle>Edit Recipe</DialogTitle>
          <DialogDescription>
            Edit your recipe for today only !
          </DialogDescription>
        </DialogHeader>
        <div className='overflow-scroll'>
        <MealEditRecipeForm columns={columnsIngredients} data={ingredients} onSave={handlesSave} recipe={recipe}/>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
