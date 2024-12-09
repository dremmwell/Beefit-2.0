
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
import AddIngredientForm from "./AddIngredientForm"
import { columns } from "./columns"
import CustomMealForm from "../today/CustomMealForm"


export function AddIngredientDialog() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleCloseDialog = () => {
    setOpen(false)
  }
 
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button >Add Ingredient</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit flex-1">
          <DialogHeader >
            <DialogTitle>New Ingredient</DialogTitle>
            <DialogDescription>
            Save a new ingredient in your list !
            </DialogDescription>
          </DialogHeader>
          <AddIngredientForm onSave={handleCloseDialog}/>
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button >Add Ingredient</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Ingredient</DrawerTitle>
          <DrawerDescription>
            Save a new ingredient in your list !
          </DrawerDescription>
        </DrawerHeader>
          <AddIngredientForm onSave={(handleCloseDialog)}/>
        <DrawerFooter className="pt-2">
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
