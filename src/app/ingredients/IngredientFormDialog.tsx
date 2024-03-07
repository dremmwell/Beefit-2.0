'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {getIngredientData} from '../../lib/data'

 
const ingredientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ingredient name must be at least 2 characters.",
  }),
  measureType: z.string(),
  customMeasureName: z.string().optional(),
  measureWeight: z.number().positive().optional(),
  calories: z.coerce.number(),
  proteins: z.coerce.number(),
  carbs: z.coerce.number(),
  fats: z.coerce.number(),
})
.refine((data) => {
  if(data.measureType === "custom") {
    return !!data.customMeasureName;
  }
  return true;
},
{
  message: "Custom measure requires a name !",
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


export function IngredientFormDialog() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof ingredientFormSchema>>({
      resolver: zodResolver(ingredientFormSchema),
      defaultValues: {
        name: "",
        measureType: "100g",
        customMeasureName: "",
      }
    });

    const measureType = form.watch("measureType");

    const [open, setOpen] = useState(false);
   
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof ingredientFormSchema>) {
      getIngredientData(values);
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
                  <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <Tabs onValueChange={field.onChange} 
                            defaultValue= "100g">
                        <TabsList className="mb-2">
                          <TabsTrigger value="per100g">Per 100g</TabsTrigger>
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
                                <Input placeholder="item, pint, cup, tsp..." {...field} />
                              </FormControl>
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
                                <Input placeholder="grams for one customMeasureName..." {...field} />
                              </FormControl>
                              <FormDescription>
                              Please indicate how many grams your custom customMeasureName weights.
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
                                <Input placeholder="calories per 100g..." required {...field} />
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
                              <Input placeholder="proteins per 100g..." required {...field} />
                            </FormControl>
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
                              <Input placeholder="carbs per 100g..." required {...field} />
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
                              <Input placeholder="fats per 100g..." required {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      </div>
                    <Button className="self-end" type="submit">Add</Button>
                  </form>
                </Form>
            </DialogContent>
           </Dialog>
    )
}
