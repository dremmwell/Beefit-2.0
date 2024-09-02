'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { createIngredient } from "../../actions/db.actions"

import { AddIngredientFormSchema } from "@/app/types/form.schema"
import { Ingredient } from "@/lib/definitions"
import { v4 as uuidv4 } from 'uuid';

// Create a new ingredient object from the add ingredient form

export function createNewIngredient(data: any,) {
    
  const uuid = uuidv4();
  const ingredient: Ingredient = {
      id: uuid,
      name: data.name,
      unit: data.measureType,
      gramsPerUnit: data.measureWeight,
      calories: data.calories,
      proteins: data.proteins,
      carbs: data.carbs,
      fats: data.fats,
      userId: "",
      bookmarked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
  }
  if(data.measureType === "100g"){
      ingredient.gramsPerUnit = 100;
  }
  else{
      ingredient.unit = data.customMeasureName;
  }
  return ingredient
}

export function AddFormDialog () {

    //  Define the form.
    const form = useForm<z.infer<typeof AddIngredientFormSchema>>({
      resolver: zodResolver(AddIngredientFormSchema),
      defaultValues: {
        measureType: "100g",
        customMeasureName: "",
        measureWeight: "",
        calories: "",
        fats: "",
        proteins: "",
        carbs:""
      }
    });

    const measureType = form.watch("measureType");

    const [open, setOpen] = useState(false);
   
    // Handles submit and data save
    function onSubmit(values: z.infer<typeof AddIngredientFormSchema>) {
      const newIngredient = createNewIngredient(values);
      form.reset();
      createIngredient(newIngredient);
      setOpen(false);
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="self-end">Add Ingredient</Button>
          </DialogTrigger>
            <DialogContent className="overflow-x-auto">
              <h3 className="text-lg font-medium">Add Ingredient</h3>
              <p className="text-sm text-muted-foreground">Add a new ingredient to your list !</p>
              <Separator /> 
                <Form {...form}>
                  <form id="ingredientForm" onSubmit={form.handleSubmit(onSubmit)}>
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
                              <FormLabel>Measure Type</FormLabel>
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
                    <Button type="submit">Add</Button>
                  </form>
                </Form>
            </DialogContent>
           </Dialog>
    )
}
