"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  RowSelectionState,
  CoreRow,
  Row
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"
import IconMenu from "@/components/icon-menu"
import { Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { CustomMealSchema } from "@/app/types/form.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from 'uuid';
import { Ingredient, Meal, MealRecipe } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import MealEditRecipeDialog from "./MealEditRecipeDialog"
import { RecipeAndIngredients, RecipeValues } from "@/app/types/definitions"
import { createMealFromRecipe } from "@/app/actions/db.actions"
import { Loader2 } from "lucide-react"

interface CustomMealForm<TData, TValue> {
  onSave: Function
}

export default function CustomMealForm<TData, TValue>({
  onSave
}: CustomMealForm<TData, TValue>) {

  const { toast } = useToast()

  //------------------------------------ Form Control -------------------------------------//
 
  const form = useForm<z.infer<typeof CustomMealSchema>>({
    resolver: zodResolver(CustomMealSchema),
    mode: "onBlur",
    defaultValues: {
      mealType: "",
      calories: "",
      proteins: "",
      carbs: "",
      fats: "",
    }
  })

  let isSubmitting = form.formState.isSubmitting;

  //------------------------------------ Data Formatting and Storing -------------------------------------//

  function createNewMeal(values : z.infer<typeof CustomMealSchema>){
    const meal : Meal = {
      id: uuidv4(),
      mealType : values.mealType,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "",
    }
    return meal
  }

  async function onSubmit (formValues: z.infer<typeof CustomMealSchema>) {

    //Handles data formatting and db storing //

    
    toast({
      title: `Meal saved`,
      description: ` A new meal have been added to your diary.`,
    });

    // Handles form reset and close //
    form.reset();
    onSave();
  };

  //---------------------------------- Component Layout ----------------------------//

  return (
    <Form {...form}>
      <form 
      id = "customMealForm"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col justify-between mx-4 my-0">
        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of meal :</FormLabel>
              <Select onValueChange={field.onChange} defaultValue="Snack">
                <FormControl>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose a type of meal"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Snack">Snack</SelectItem>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Diner">Diner</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Name / Description</FormLabel>
              <FormControl>
                <Input 
                placeholder="Meal name..."
                type=""
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-between">
        <FormField
          control={form.control}
          name="calories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories (cal)</FormLabel>
              <FormControl>
                <Input 
                placeholder="Calories in your meal..."
                type="number"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                  <FormField
          control={form.control}
          name="proteins"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proteins (g)</FormLabel>
              <FormControl>
                <Input 
                placeholder="Proteins in your meal..."
                type="number"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="flex gap-4 justify-between">
        <FormField
          control={form.control}
          name="carbs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carbohydrates (g)</FormLabel>
              <FormControl>
                <Input 
                placeholder="Carbs in your meal..."
                type="number"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
                <FormField
          control={form.control}
          name="fats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fats (g)</FormLabel>
              <FormControl>
                <Input 
                placeholder="Fats in your meal..."
                type="number"
                {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button  disabled={isSubmitting} className="mb-4 md:mb-0" type="submit" form="customMealForm">
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Create Meal
        </Button>
      </form>
    </Form>
    )
}

