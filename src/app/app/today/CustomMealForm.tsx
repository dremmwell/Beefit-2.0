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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CustomMealSchema } from "@/app/types/form.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from 'uuid';
import { ArchivedMeal } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { createCustomMeal } from "@/app/actions/db.actions"

export default function CustomMealForm({onSave} : {onSave : Function}) {

  const { toast } = useToast()

  //------------------------------------ Form Control -------------------------------------//
 
  const form = useForm<z.infer<typeof CustomMealSchema>>({
    resolver: zodResolver(CustomMealSchema),
    mode: "onBlur",
    defaultValues: {
      mealType: "Snack",
    }
  })

  let isSubmitting = form.formState.isSubmitting;

  //------------------------------------ Data Formatting and Storing -------------------------------------//

  function createNewMeal(values : z.infer<typeof CustomMealSchema>){
    const meal : ArchivedMeal = {
      id: uuidv4(),
      description : values.description,
      mealType : values.mealType,
      calories: values.calories,
      proteins: values.proteins,
      carbs: values.carbs,
      fats: values.fats,
      createdAt: new Date(),
      userId: "",
    }
    return meal
  }

  async function onSubmit (formValues: z.infer<typeof CustomMealSchema>) {
    try{
      //Handles data formatting and db storing //
      const newMeal = createNewMeal(formValues);
      await createCustomMeal(newMeal)
      toast({
        title: `Meal saved`,
        description: `A new meal have been added to your diary.`,
      });
      // Handles form reset and close //
      form.reset();
      onSave();
    }
    catch(error){
      console.log(error)
      toast({
        title: `Failed to create your meal. Please try again.`,
      });
    }
  };

  //---------------------------------- Component Layout ----------------------------//

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-2">
        <FormField
          control={form.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of meal :</FormLabel>
              <Select onValueChange={field.onChange} defaultValue="Snack">
                <FormControl>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose a type of meal" />
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
                    type="text"
                    {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
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
          </div>
          <div className="col-span-6">
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
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
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
          </div>
          <div className="col-span-6">
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
        </div>
        <Button  disabled={isSubmitting} className="mb-4 md:mb-0 w-full" type="submit">
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Create Meal
        </Button>
      </form>
    </Form>
    )
}