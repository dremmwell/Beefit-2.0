"use client"

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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from 'uuid';
import { ArchivedMeal } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Ingredient } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createIngredient } from "@/app/actions/db.actions";
import { AddIngredientSchema } from "@/app/types/form.schema";


export default function AddIngredientForm({onSave} : {onSave : Function}) {

  const { toast } = useToast()

  //------------------------------------ Form Control -------------------------------------//
 
  const form = useForm<z.infer<typeof AddIngredientSchema>>({
    resolver: zodResolver(AddIngredientSchema),
    mode: "onBlur",
    defaultValues: {
      measureType: "100g",
    }
  })

  let isSubmitting = form.formState.isSubmitting;

  //------------------------------------ Data Formatting and Storing -------------------------------------//

  // Creates a new ingredient object from the add ingredient form
function createNewIngredient(data: z.infer<typeof AddIngredientSchema>) {
    
    const uuid = uuidv4();

    if(data.measureType === "custom"){
        const ingredient: Ingredient = {
          id: uuid,
          name: data.name,
          //@ts-ignore
          unit: data.customMeasureName,
          //@ts-ignore
          gramsPerUnit: data.measureWeight,
          calories: data.calories,
          proteins: data.proteins,
          carbs: data.carbs,
          fats: data.fats,
          userId: "",
          bookmarked: false,
          customMeal: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        return ingredient
    }else{
        const ingredient: Ingredient = {
          id: uuid,
          name: data.name,
          unit: data.measureType,
          gramsPerUnit: 100,
          calories: data.calories,
          proteins: data.proteins,
          carbs: data.carbs,
          fats: data.fats,
          userId: "",
          bookmarked: false,
          customMeal: false,
          createdAt: new Date(),
          updatedAt: new Date(),
      }
      return ingredient
    }
  }

  // Handles measure type toggle
  const measureType = form.watch("measureType");
  
  async function onSubmit (formValues: z.infer<typeof AddIngredientSchema>) {
    try{
      //Handles data formatting and db storing //
      const newIngredient = createNewIngredient(formValues)
      await createIngredient(newIngredient);

      toast({
        title: `Ingredient "${newIngredient.name}" saved`,
        description: `${newIngredient.name} have been added to the database.`,
    });
      // Handles form reset and close //
      form.reset();
      onSave();
    }
    catch(error){
      console.log(error)
      toast({
        title: `Failed to create your ingredient. Please try again.`,
      });
    }
  };

  //---------------------------------- Component Layout ----------------------------//

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-3xl md:mx-auto mx-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Name / Description</FormLabel>
                  <FormControl>
                    <Input 
                    placeholder="Meal name..."
                    type="text"
                    {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="measureType"
              render={({field}) => (
                  <Tabs defaultValue= {measureType} 
                      onValueChange={field.onChange} >
                  <TabsList className="mb-2">
                      <TabsTrigger value="100g">Per 100g</TabsTrigger>
                      <TabsTrigger value="custom">Custom Measure</TabsTrigger>
                  </TabsList>
                  </Tabs>
              )}
            />
            {measureType === "custom" && 
              <div className="flex gap-4">
              <div className="w-5/6">
                  <FormField
                  control={form.control}
                  name="customMeasureName"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Measure Name</FormLabel>
                      <FormControl>
                      <Input {...field}
                      placeholder="Item, pint, tsp, cup..." />
                      </FormControl>
                      <FormDescription>
                      Custom measure name
                      </FormDescription>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              </div>
                  <FormField
                  control={form.control}
                  name="measureWeight"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>Measure Weight (g)</FormLabel>
                      <FormControl>
                      <Input {...field}
                      type="number"
                      placeholder="in grams..." />
                      </FormControl>
                      <FormDescription>
                      Please indicate how many grams your custom measure weights.
                      </FormDescription>
                      <FormMessage />
                  </FormItem>
                  )}
              />
              </div>
            }
            <div className="flex gap-4 justify-between">
                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories (cal)</FormLabel>
                      <FormControl>
                        <Input 
                        placeholder="in cal..."
                        type="number"
                        {...field} />
                      </FormControl>
                      {measureType === "100g" &&
                        <FormDescription>
                            per 100g of ingredient
                        </FormDescription>
                        }
                        {measureType === "custom" &&
                        <FormDescription>
                            per measure
                        </FormDescription>
                        }
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
                        placeholder="in grams..."
                        type="number"
                        {...field} />
                      </FormControl>
                      {measureType === "100g" &&
                        <FormDescription>
                            per 100g of ingredient
                        </FormDescription>
                        }
                        {measureType === "custom" &&
                        <FormDescription>
                            per measure
                        </FormDescription>
                        }
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
                          placeholder="in grams..."
                          type="number"
                          {...field} />
                        </FormControl>
                        {measureType === "100g" &&
                        <FormDescription>
                            per 100g of ingredient
                        </FormDescription>
                        }
                        {measureType === "custom" &&
                        <FormDescription>
                            per measure
                        </FormDescription>
                        }
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
                          placeholder="in grams..."
                          type="number"
                          {...field} />
                        </FormControl>
                        {measureType === "100g" &&
                        <FormDescription>
                            per 100g of ingredient
                        </FormDescription>
                        }
                        {measureType === "custom" &&
                        <FormDescription>
                            per measure
                        </FormDescription>
                        }
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
          <Button  disabled={isSubmitting} className="mb-4 md:mb-0 w-full" type="submit">
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Create Ingredient
          </Button>
      </form>
    </Form>
    )
}