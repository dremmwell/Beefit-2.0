'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateIngredient } from "../../actions/db.actions"
import { Ingredient } from "@prisma/client"
import { EditIngredientFormSchema } from "@/app/types/form.schema"
import React, { Dispatch, SetStateAction } from 'react';


// Edit the selected ingredient through the edit form

export function editIngredient(data: any, ingredient: Ingredient) {
    
  const newIngredient: Ingredient = {
      id: ingredient.id,
      name: data.name,
      unit: data.measureType,
      gramsPerUnit: data.measureWeight,
      calories: data.calories,
      proteins: data.proteins,
      carbs: data.carbs,
      fats: data.fats,
      userId: ingredient.userId,
      bookmarked: ingredient.bookmarked,
      createdAt: ingredient.createdAt,
      updatedAt: new Date()
  }
  if(data.measureType === "100g"){
      newIngredient.gramsPerUnit = 100;
  }
  else{
      newIngredient.unit = data.customMeasureName;
  }
  return newIngredient
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
    const form = useForm<z.infer<typeof EditIngredientFormSchema>>({
      resolver: zodResolver(EditIngredientFormSchema),
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

    let measureType = initialMeasureType;
    measureType = form.watch("measureType");
   
    // Handles submit and data save

    const onSubmit = async (values: z.infer<typeof EditIngredientFormSchema>) => {
      try {
        const newIngredient = editIngredient(values,ingredient);
        form.reset();
        updateIngredient(newIngredient);
        onSave()
      }
      catch (error) {
        console.log(error)
      }
    }

    return (
            <Form {...form}>
              <form id="ingredientForm" onSubmit={form.handleSubmit(onSubmit)} className="px-4 md:px-0">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="ingredient name..." required {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                          Per item, pint, tsp...
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
                            <Input {...field} />
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
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="calories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calories (g)</FormLabel>
                          <FormControl>
                            <Input required {...field} />
                          </FormControl>
                          {measureType === "100g" &&
                            <FormDescription>
                              calories per 100g
                            </FormDescription>
                          }
                          {measureType === "custom" &&
                            <FormDescription>
                              calories per measure
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
                          <Input required {...field} />
                        </FormControl>
                        {measureType === "100g" &&
                            <FormDescription>
                              proteins per 100g
                            </FormDescription>
                          }
                          {measureType === "custom" &&
                            <FormDescription>
                              proteins per measure
                            </FormDescription>
                          }
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                  <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="carbs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl>
                          <Input required {...field} />
                        </FormControl>
                        {measureType === "100g" &&
                            <FormDescription>
                              carbs per 100g
                            </FormDescription>
                          }
                          {measureType === "custom" &&
                            <FormDescription>
                              carbs per measure
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
                          <Input required {...field} />
                        </FormControl>
                        {measureType === "100g" &&
                            <FormDescription>
                              fats per 100g
                            </FormDescription>
                          }
                          {measureType === "custom" &&
                            <FormDescription>
                              fats per measure
                            </FormDescription>
                          }
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                <Button className="mt-auto w-full" type="submit">Edit</Button>
              </form>
            </Form>
    )
}
