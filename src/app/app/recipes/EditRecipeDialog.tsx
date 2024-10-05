import React, { Dispatch, SetStateAction } from 'react';

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
import EditRecipeForm from './EditRecipeForm';
import { columns } from "./columns"
import { ScrollArea } from '@/components/ui/scroll-area';
import { RecipeAndIngredients } from '@/app/types/definitions';

export default function EditRecipeDialog({
  recipe,
  ingredients,
  isOpen,
  setIsOpen
}: {
  recipe : RecipeAndIngredients,
  ingredients : Array<Ingredient>
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
}) {

  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-fit min-h-[620px] flex-1">
          <DialogHeader >
            <DialogTitle>Edit Recipe</DialogTitle>
            <DialogDescription>
              Edit and save your recipe updates!
            </DialogDescription>
          </DialogHeader>
          <EditRecipeForm columns={columns} data={ingredients} onSave={setIsOpen} recipe={recipe}/>
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Recipe</DrawerTitle>
          <DrawerDescription>
          Edit and save your recipe updates!
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-scroll no-scrollbar">
          <EditRecipeForm columns={columns} data={ingredients} onSave={setIsOpen} recipe={recipe}/>
        </ScrollArea>
        <DrawerFooter className="pt-2">
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
