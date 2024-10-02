
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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Ingredient } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EditIngredientForm } from "./EditIngredientForm"
import { columns } from "./columns"
import { Dispatch, SetStateAction } from 'react';


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
 
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-fit flex-1">
          <DialogHeader >
            <DialogTitle>New Ingredient</DialogTitle>
            <DialogDescription>
            Save a new ingredient in your list !
            </DialogDescription>
          </DialogHeader>
          <EditIngredientForm ingredient={ingredient} onSave={handleCloseDialog}/>
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
            Save a new ingredient in your list !
          </DrawerDescription>
        </DrawerHeader>
          <EditIngredientForm ingredient={ingredient} onSave={(handleCloseDialog)}/>
        <DrawerFooter className="pt-2">
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
