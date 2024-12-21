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
import IconMenu from "@/components/icon-menu"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { MealIngredientSchema } from "@/app/types/form.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from 'uuid';
import { MealIngredient, Recipe, RecipeIngredient } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import { Meal } from "@prisma/client"
import { createMealFromIngredients } from "@/app/actions/db.actions/meal.actions"
import { Loader2 } from "lucide-react"


interface MealIngredientsForm<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[],
  onSave: Function
}

export default function MealIngredientsForm<TData, TValue>({
  columns,
  data,
  onSave
}: MealIngredientsForm<TData, TValue>) {

  const { toast } = useToast()

  //---------------------------------- Table Properties -------------------------------------//

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  //------------------------------------ Form Validation -------------------------------------//
 
  const form = useForm<z.infer<typeof MealIngredientSchema>>({
    resolver: zodResolver(MealIngredientSchema),
    mode: "onBlur",
    defaultValues: {
      meal: "Snack",
      ingredients: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control: form.control,
  });

  let isSubmitting : boolean = form.formState.isSubmitting;

    //------------------------------------ Data Formatting and Storing -------------------------------------//

  function createNewMeal(values : z.infer<typeof MealIngredientSchema>){
      const meal : Meal = {
        id: uuidv4(),
        mealType : values.meal,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "",
      }
      return meal
  }

  function createIngredientArray(values : z.infer<typeof MealIngredientSchema>, meal : Meal){
    const mealIngredients : Array<MealIngredient> = []
      values.ingredients.forEach((ingredient) => {
        if(ingredient.quantity){
          const mealIngredient : MealIngredient = {
              id: uuidv4(),
              ingredientId: ingredient.ingredientid,
              mealId: meal.id,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              createdAt: new Date(),
              updatedAt: new Date(),
          }
          mealIngredients.push(mealIngredient)
        }
      });
      return mealIngredients
  }

  async function onSubmit (formValues: z.infer<typeof MealIngredientSchema>) {

    try{
      //Handles data formatting and db storing //
      const meal = createNewMeal(formValues);
      const mealIngredientArray = createIngredientArray(formValues, meal);
      await createMealFromIngredients(meal, mealIngredientArray);
      
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

  //--------------------------- Handles Row Selection and display -------------------------//

  function handlesRowSelect(row : Row<TData>) {
    if(!row.getIsSelected()){
      row.toggleSelected(true)
      append({
        quantity: "",
         // @ts-ignore
        unit: "grams",
        // @ts-ignore
        name: row.original.name,
        // @ts-ignore
        ingredientid: row.original.id,
        rowid: row.id, 
        // @ts-ignore
        gramsPerUnit: row.original.gramsPerUnit,
        // @ts-ignore
        ingredientUnit: row.original.unit
      })
    }
  }


  function handlesDelete(index: number, id: string){
    const row = table.getRow(id);
    row.toggleSelected(false)
    remove(index);
  }

  //---------------------------------- Component Layout ----------------------------//

  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col mx-4 my-0 min-h-[500px]">
        <FormField
          control={form.control}
          name="meal"
          render={({ field }) => (
            <FormItem >
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
        <div className="flex flex-col gap-4">
          <h2 className="scroll-m-20 border-b pb-2 text-sm font-medium tracking-tight first:mt-0">
              Select Ingredients :
          </h2>
          <div className="flex md:flex-row flex-col">
            <div className="md:min-h-[300px] md:min-w-[300px] w-full flex flex-col gap-2 mt-2 grow-0 md:max-w-96">
                <Input
                  id="filterInput"
                  placeholder="Search ingredients..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
              <ScrollArea className="overflow-y-scroll md:overflow-y-hidden no-scrollbar rounded-md border max-h-80 w-full min-w-40">
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
              <div className="flex-1 text-sm text-muted-foreground py-2 mb-5">
                {table.getSelectedRowModel().rows.length} ingredient(s) selected. 
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-2 grow md:my-5 mb-4">
              <ScrollArea className="md:max-h-[400px] mx-2">
              {fields.map((fieldArray, index) => (
                  <div  
                  key={fieldArray.id}
                  className="flex gap-2 p-2 justify-between"      
                  >
                    <div className="text-sm mt-2 basis-1/3">
                        {fieldArray.name}
                    </div>
                    <FormField 
                    control={form.control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="flex items-center mb-0 gap-2">
                        <FormControl>
                          <Input 
                          {...field} 
                          className="w-[100px] justify-end"
                          autoFocus
                          type="number"
                          placeholder="Quantity..."
                          required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                    {fieldArray.ingredientUnit === "100g" ?
                    <div className="flex items-center">
                      <div className="text-sm">grams</div>
                    </div>
                    :
                      <FormField 
                      control={form.control}
                      name={`ingredients.${index}.unit`}
                      render={({ field }) => (
                          <FormItem className="mb-0 flex items-center">
                            <Select onValueChange={field.onChange} defaultValue="grams">
                              <FormControl>
                              <SelectTrigger className="max-w-[100px]">
                                <SelectValue placeholder="Choose a unit" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="grams">grams</SelectItem>
                                <SelectItem value={fieldArray.ingredientUnit}>{fieldArray.ingredientUnit}(s)</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                      )}
                      />
                    }
                    <div className="flex mt-1">
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
                ))}
                </ScrollArea>
            </div>
          </div>
        </div>
        <Button disabled={isSubmitting} className="mt-auto mb-4 md:mb-0" type="submit">
        {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Create Meal
        </Button>
      </form>
    </Form>
    )
}

