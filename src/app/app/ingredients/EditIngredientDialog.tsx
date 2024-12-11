
"use client"

import * as React from "react"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"
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
import { Ingredient } from "@prisma/client"
import { EditIngredientForm } from "./EditIngredientForm"
import { Dispatch, SetStateAction } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area"


export function EditIngredientDialog(
  {
    ingredient,
    isOpen,
    setIsOpen
  }: {
    ingredient: Ingredient
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
  }
) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleCloseDialog = () => {
    setIsOpen(false)
  }
 
  if (true) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-fit max-h-full flex-1">
          <DialogHeader >
            <DialogTitle>Edit Ingredient</DialogTitle>
            <DialogDescription>
              Edit your ingredient !
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="overflow-y-scroll no-scrollbar">
            <EditIngredientForm ingredient={ingredient} onSave={handleCloseDialog}/>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Ingredient</DrawerTitle>
          <DrawerDescription>
            Edit your ingredient !
          </DrawerDescription>
        </DrawerHeader>
          <EditIngredientForm ingredient={ingredient} onSave={(handleCloseDialog)}/>
        <DrawerFooter className="pt-2">
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
