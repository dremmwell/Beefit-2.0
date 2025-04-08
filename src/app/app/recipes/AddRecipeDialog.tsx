
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
import { getIngredients } from "@/app/actions/db.actions/ingredient.actions"
import { User } from "lucia"


export function AddRecipeDialog( { user } : { user : User }) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [ingredients, setIngredients] = useState<Array<Ingredient>>()

  useEffect(() => {
    async function fetchIngredients() {
    const data :Array<Ingredient> = await getIngredients(user.id);
    setIngredients(data)
    }
    fetchIngredients()
  }, [user.id])

  const handleCloseDialog = () => {
    setOpen(false)
  }
 
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
        {ingredients &&
          <ScrollArea className="overflow-y-scroll no-scrollbar">
            <AddRecipeForm columns={columns} data={ingredients} onSave={handleCloseDialog}/>
          </ScrollArea>
        }
      </DialogContent>
    </Dialog>
  )
}
