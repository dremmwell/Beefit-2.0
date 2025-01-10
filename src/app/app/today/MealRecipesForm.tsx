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
import { MealRecipeSchema } from "@/app/types/form.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from 'uuid';
import { Ingredient, Meal, MealRecipe } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import MealEditRecipeDialog from "./MealEditRecipeDialog"
import { RecipeAndIngredients, RecipeValues } from "@/app/types/definitions"
import { createMealFromRecipe } from "@/app/actions/db.actions/meal.actions"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

interface MealrecipesForm<TData, TValue> {
  ingredients: Array<Ingredient>
  columns: ColumnDef<TData, TValue>[],
  data: TData[],
  onSave: Function
}

export default function MealRecipeForm<TData, TValue>({
  ingredients,
  columns,
  data,
  onSave
}: MealrecipesForm<TData, TValue>) {

  const { toast } = useToast()

  //---------------------------------- Table Properties -------------------------------------//

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isFilterDisabled, setIsFilterDisabled]  = useState<Boolean>(false)
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualFiltering: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  //------------------------------------ Form Control -------------------------------------//
 
  const form = useForm<z.infer<typeof MealRecipeSchema>>({
    resolver: zodResolver(MealRecipeSchema),
    mode: "onBlur",
    defaultValues: {
      meal: "Snack",
      recipe: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: "recipe",
    control: form.control,
  });

  let isSubmitting = form.formState.isSubmitting;

  //------------------------------------ Data Formatting and Storing -------------------------------------//

  function createNewMeal(values : z.infer<typeof MealRecipeSchema>){
    const meal : Meal = {
      id: uuidv4(),
      mealType : values.meal,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "",
    }
    return meal
  }

  function createNewMealFromRecipe(values : z.infer<typeof MealRecipeSchema>, recipe : RecipeAndIngredients, meal : Meal){
    const mealRecipes : Array<MealRecipe> = []
    values.recipe.forEach((recipeData) => {
      if(recipeData.quantity){
        const mealRecipe : MealRecipe = {
          id: uuidv4(),
          recipeId: recipe.id,
          mealId: meal.id,
          quantity: recipeData.quantity,
          unit: recipeData.unit,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        mealRecipes.push(mealRecipe)
      }
    })
    return mealRecipes
  }

  async function onSubmit (formValues: z.infer<typeof MealRecipeSchema>) {

    try{
      //Handles data formatting and db storing //
      if(selectedRecipe){
        const meal = createNewMeal(formValues);
        const mealRecipes = createNewMealFromRecipe(formValues, selectedRecipe, meal);
        await createMealFromRecipe(meal, mealRecipes)
      }
      toast({
        title: `Meal saved`,
        description: ` A new meal have been added to your diary.`,
      });

      // Handles form reset and close //
      remove();
      form.reset();
      onSave();
    }
    catch(error){
      console.log(error)
    }
  };

//----------------------------------- Recipe Selection and display ------------------------------//

const [isRowSelected, setIsRowSelected] = useState(false)
const [selectedRecipe, setSelectedRecipe] = useState<RecipeAndIngredients>();

  function handlesRowSelect(row : Row<TData>) {
    if(!row.getIsSelected()){
        if(!isRowSelected){
            setIsRowSelected(true) 
            row.toggleSelected(true)
            // @ts-ignore/
            setSelectedRecipe(row.original)
            append({
              quantity: "",
               // @ts-ignore
              unit: "grams",
              // @ts-ignore
              name: row.original.name,
              // @ts-ignore
              recipeid: row.original.id,
              rowid: row.id, 
            })
        }
    }
  }

  function handlesDelete(index: number, id: string){
    const row = table.getRow(id);
    row.toggleSelected(false)
    remove(index);
    setIsRowSelected(false);
  }

  function onEditRecipe(recipe : RecipeAndIngredients){
    setSelectedRecipe(recipe)
  }

  //---------------------------------- Component Layout ----------------------------//

  return (
    <Form {...form}>
      <form 
      id = "mealRecipeForm"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col justify-between mx-4 my-0">
        <FormField
          control={form.control}
          name="meal"
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
        <div className="flex flex-col">
        {!isRowSelected ?
          <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b pb-2">
            <h2 className="my-auto scroll-m-20 text-sm">
              Select a Recipe :
            </h2>
            <Link className={buttonVariants({ variant: "outline"})} href="/app/recipes">New Recipe</Link>
          </div>
            <div className="md:min-w-[300px] w-full flex flex-col gap-2 mt-2 grow-0 md:max-w-96">
                <Input
                  id="filterInput"
                  placeholder="Search recipes..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  //@ts-ignore/
                  disabled={isFilterDisabled} 
                  className="max-w-sm"
                />
              <ScrollArea className="overflow-y-scroll no-scrollbar rounded-md border max-h-80 w-full min-w-40 mb-4">
                  <Table >
                      <TableBody>
                      { table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            onClick={() => {
                              handlesRowSelect(row);
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                        </TableRow>
                        ))
                      ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 cursor-pointer">
                            No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  </Table>
              </ScrollArea>
            </div>
          </div>
          :
          <div className="flex flex-col gap-4 my-4">
          <h2 className="scroll-m-20 border-b pb-2 text-sm font-medium tracking-tight first:mt-0">
              Selected recipe :
          </h2>
          <ScrollArea className="md:max-h-[400px]">
          {fields.map((fieldArray, index) => (
              <div  
              key={fieldArray.id}
              className="flex flex-col gap-8 p-2 justify-between"      
              >
                <div className="text-sm mt-2 basis-1/3 flex">
                <div className="my-auto mr-2">
                    {selectedRecipe?.name}
                  </div>
                  <div className="flex ml-auto gap-4">
                    {selectedRecipe &&
                    // @ts-ignore /
                    <MealEditRecipeDialog ingredients={ingredients} recipe={selectedRecipe} onEdit={onEditRecipe}/>
                    }    
                    <button
                      onMouseDownCapture={() => handlesDelete(index, fieldArray.rowid)}
                      className="text-primary"
                    >
                      <IconMenu
                        text=""
                        icon={<Trash2 className="h-5 w-5"/>}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="my-auto text-sm">
                  Portion :
                  </div>
                  <FormField 
                  control={form.control}
                  name={`recipe.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex items-center mb-0 gap-2">
                      <FormControl>
                        <Input 
                        {...field} 
                        className="max-w-[110px]"
                        placeholder="Quantity"
                        required
                        type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                    <FormField 
                    control={form.control}
                    name={`recipe.${index}.unit`}
                    render={({ field }) => (
                        <FormItem className="mb-0 flex items-center">
                          <Select onValueChange={field.onChange} defaultValue="grams">
                            <FormControl>
                            <SelectTrigger className="max-w-[200px]">
                              <SelectValue placeholder="Choose a unit" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="grams">grams</SelectItem>
                              <SelectItem value="1">whole recipe(s)</SelectItem>
                              <SelectItem value="1/2">1/2</SelectItem>
                              <SelectItem value="1/3">1/3</SelectItem>
                              <SelectItem value="1/4">1/4</SelectItem>
                              <SelectItem value="1/5">1/5</SelectItem>
                              <SelectItem value="1/6">1/6</SelectItem>
                              <SelectItem value="1/8">1/8</SelectItem>
                            </SelectContent>
                          </Select>
                          {(field.value === "grams" || field.value === "1") ?
                            <></>
                            :
                            <div className="text-sm min-w-[60px] my-auto ml-2 pb-2">
                              of recipe
                            </div>
                          }
                        </FormItem>
                    )}
                    />
                </div>
              </div>
            ))}
            </ScrollArea>
            </div>
        }
            </div>
        <Button  disabled={isSubmitting} className="mb-4 md:mb-0 mt-12" type="submit" form="mealRecipeForm">
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Create Meal
        </Button>
      </form>
    </Form>
    )
}

