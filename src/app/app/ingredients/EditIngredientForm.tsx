'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateIngredient } from "../../actions/db.actions"
import { Ingredient } from "@prisma/client"
import { AddIngredientSchema } from "@/app/types/form.schema"
import React from 'react';
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"


// Edit the selected ingredient through the edit form

export function editIngredient(data: z.infer<typeof AddIngredientSchema>, ingredient: Ingredient) {
    
  if(data.measureType === "custom"){
    const newIngredient: Ingredient = {
      id: ingredient.id,
      name: data.name,
      //@ts-ignore
      unit: data.customMeasureName,
      //@ts-ignore
      gramsPerUnit: data.measureWeight,
      calories: data.calories,
      proteins: data.proteins,
      carbs: data.carbs,
      fats: data.fats,
      userId: ingredient.userId,
      bookmarked: ingredient.bookmarked,
      customMeal: ingredient.customMeal,
      createdAt: ingredient.createdAt,
      updatedAt: new Date()
    }
    return newIngredient
  }else{
    const newIngredient: Ingredient = {
      id: ingredient.id,
      name: data.name,
      unit: data.measureType,
      gramsPerUnit: 100,
      calories: data.calories,
      proteins: data.proteins,
      carbs: data.carbs,
      fats: data.fats,
      userId: ingredient.userId,
      bookmarked: ingredient.bookmarked,
      customMeal: ingredient.customMeal,
      createdAt: ingredient.createdAt,
      updatedAt: new Date()
    }
    return newIngredient
  }
}

export function EditIngredientForm ( {
  ingredient,
  onSave
}: {
  ingredient: Ingredient
  onSave: Function;
}){

  let initialMeasureType;
  if(ingredient.gramsPerUnit == 100){
    initialMeasureType = "100g";
  }
  else{
    initialMeasureType = "custom";
  }

    //  Define the form.
    const form = useForm<z.infer<typeof AddIngredientSchema>>({
      resolver: zodResolver(AddIngredientSchema),
      defaultValues: {
        name: ingredient.name,
        measureType: initialMeasureType,
        customMeasureName: ingredient.unit,
        measureWeight: ingredient.gramsPerUnit,
        calories: ingredient.calories,
        proteins: ingredient.proteins,
        carbs: ingredient.carbs,
        fats: ingredient.fats,
      }
    });

    let isSubmitting : boolean = form.formState.isSubmitting;

    console.log(ingredient)

    let measureType = initialMeasureType;
    measureType = form.watch("measureType");

    const { toast } = useToast()
   
    // Handles submit and data save

    const onSubmit = async (values: z.infer<typeof AddIngredientSchema>) => {
      try {
        const newIngredient = editIngredient(values,ingredient);
        await updateIngredient(newIngredient);

        toast({
          title: `Ingredient "${ingredient.name}" updated`,
          description: `${ingredient.name} have been updated on the database`,
      });
        form.reset();
        onSave()
      }
      catch (error) {
        console.log(error)
        toast({
          title: `Failed to update your ingredient. Please try again.`,
        });
      }
    }

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
