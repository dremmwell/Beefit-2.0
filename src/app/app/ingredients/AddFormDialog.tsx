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

import {createNewIngredient} from '../../../lib/ingredients_utils'
import { createIngredient } from "../../actions/actions"
import { Ingredient } from "@/lib/definitions"
 
const ingredientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ingredient name must be at least 2 characters.",
  }),
  measureType: z.string(),
  customMeasureName: z.string().optional(),
  measureWeight: z.coerce.number().optional(),
  calories: z.coerce.number().positive(),
  proteins: z.coerce.number().positive(),
  carbs: z.coerce.number().positive(),
  fats: z.coerce.number().positive(),
})
.refine((data) => {
  if(data.measureType === "custom") {
    return !!data.customMeasureName;
  }
  return true;
},
{
  message: "Custom measure requires a name",
  path: ["customMeasureName"],
}
)
.refine((data) => {
  if(data.measureType === "custom") {
    return !!data.measureWeight;
  }
  return true;
},
{
  message: "Custom measure requires a weight",
  path: ["measureWeight"],
}
);

export function AddFormDialog () {

    //  Define the form.
    const form = useForm<z.infer<typeof ingredientFormSchema>>({
      resolver: zodResolver(ingredientFormSchema),
      defaultValues: {
        name: "",
        measureType: "100g",
        customMeasureName: "",
        measureWeight: undefined,
        calories: undefined,
        proteins: undefined,
        carbs: undefined,
        fats: undefined
      }
    });


    const measureType = form.watch("measureType");

    const [open, setOpen] = useState(false);
   
    // Handles submit and data save
    function onSubmit(values: z.infer<typeof ingredientFormSchema>) {
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
