
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { Ingredient } from "@prisma/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import EditRecipeDialog from "../recipes/EditRecipeDialog"
import { RecipeAndIngredients } from "@/app/types/definitions"
import { Dispatch } from "react"
import { SetStateAction } from "react"
import { Recipe } from "@prisma/client"
import MealIngredientsForm from "./MealIngredientsForm"
import { columns } from "../recipes/columns"



export function AddMealDialog( {
  recipes,
  ingredients,
} : {
  recipes : Array<Recipe>,
  ingredients : Array<Ingredient>
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleCloseDialog = () => {
    setOpen(false)
  }
 
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button >Add Meal</Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit min-h-[620px] flex-1">
        <DialogHeader >
            <DialogTitle>New Meal</DialogTitle>
            <DialogDescription>
              Add a new meal to your diary !
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="ingredients">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients">
              <MealIngredientsForm columns={columns} data={ingredients} onSave={setOpen}/>
            </TabsContent>
            <TabsContent value="recipes">

            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button >Add Meal</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>New Meal</DrawerTitle>
          <DrawerDescription>
            Add a new meal to your diary !
          </DrawerDescription>
        </DrawerHeader>
          <ScrollArea className="overflow-y-scroll no-scrollbar">
            <Tabs defaultValue="ingredients">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                <TabsTrigger value="recipes">Recipes</TabsTrigger>
              </TabsList>
              <TabsContent value="ingredients">
                  <MealIngredientsForm columns={columns} data={ingredients} onSave={setOpen}/>
              </TabsContent>
              <TabsContent value="recipes">

              </TabsContent>
            </Tabs>
          </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
