
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
import { useState, useEffect } from "react"
import AddIngredientForm from "./AddIngredientForm"
import { ScrollArea } from "@/components/ui/scroll-area"


export function AddIngredientDialog() {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleCloseDialog = () => {
    setOpen(false)
  }
 
  if (true) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button >Add Ingredient</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit max-h-full flex-1">
          <DialogHeader >
            <DialogTitle>New Ingredient</DialogTitle>
            <DialogDescription>
            Save a new ingredient in your list !
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="overflow-y-scroll no-scrollbar">
            <AddIngredientForm onSave={handleCloseDialog}/>
          </ScrollArea>
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
