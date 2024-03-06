"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"

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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

 
const ingredientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ingredient name must be at least 2 characters.",
  }),
  measure: z.string().min(1).optional(),
  measureWeight: z.number().positive().optional(),
  calories: z.number().positive(),
  proteins: z.number().positive(),
  carbs: z.number().positive(),
  fats: z.number().positive(),
})

export function IngredientForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof ingredientFormSchema>>({
      resolver: zodResolver(ingredientFormSchema),
      defaultValues: {
        name: "",
        measure: "",
        measureWeight: 0,
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0,
      }
    });
   
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof ingredientFormSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log({values})
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="ingredient name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Tabs defaultValue="per100g">
            <TabsList className="mb-2">
              <TabsTrigger value="per100g">Per 100g</TabsTrigger>
              <TabsTrigger value="custom">Custom Measure</TabsTrigger>
            </TabsList>
            <TabsContent value="per100g">
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
            </TabsContent>
            <TabsContent value="custom">
              <div className="flex gap-4">
                <div className="w-5/6">
                <FormField
                control={form.control}
                name="measure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measure Type</FormLabel>
                    <FormControl>
                      <Input placeholder="item, pint, cup, tsp..."{...field} />
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
                      <Input placeholder="grams for one measure..." {...field} />
                    </FormControl>
                    <FormDescription>
                    Please indicate how many grams your custom measure weights.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calories (g)</FormLabel>
                  <FormControl>
                    <Input placeholder="calories per item..." required {...field} />
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
                    <Input placeholder="proteins per item..." required {...field} />
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
                    <Input placeholder="carbs per item..." required {...field} />
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
                    <Input placeholder="fats per item..." required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            </TabsContent>
          </Tabs>
          <Button className="self-end" type="submit">Add</Button>
        </form>
      </Form>
    )
}