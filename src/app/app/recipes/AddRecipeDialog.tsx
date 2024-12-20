
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
import { Ingredient } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import AddRecipeForm from "./AddRecipeForm"
import { columns } from "./columns"


export function AddRecipeDialog( {
  ingredients
}:{
  ingredients: Array<Ingredient>
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleCloseDialog = () => {
    setOpen(false)
  }
 
  if (true) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button >Create Recipe</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit min-h-[620px] max-h-full flex-1">
          <DialogHeader >
            <DialogTitle>New Recipe</DialogTitle>
            <DialogDescription>
              Create a new recipe and add it to your list!
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="overflow-y-scroll no-scrollbar">
            <AddRecipeForm columns={columns} data={ingredients} onSave={handleCloseDialog}/>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button >Create Recipe</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Recipe</DrawerTitle>
          <DrawerDescription>
            Create a new recipe and add it to your list!
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-scroll no-scrollbar">
          <AddRecipeForm columns={columns} data={ingredients} onSave={(handleCloseDialog)}/>
        </ScrollArea>
        <DrawerFooter className="pt-2">
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
