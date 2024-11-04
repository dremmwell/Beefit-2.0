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
import { Ingredient, Recipe, RecipeIngredient } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"
import MealEditRecipeForm from "./MealEditRecipeForm"
import MealEditRecipeDialog from "./MealEditRecipeDialog"
import { RecipeAndIngredients, RecipeValues } from "@/app/types/definitions"
import { getRecipeValues } from "@/lib/recipe_utils"
import { isEqual } from "lodash"


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

  //------------------------------------ Form Validation -------------------------------------//
 
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

  function createNewMealFromRecipe(values : z.infer<typeof MealRecipeSchema>){
    console.log(values)
  }

  async function onSubmit (formValues: z.infer<typeof MealRecipeSchema>) {

    console.log(selectedRecipe,formValues)

    //Handles data formatting and db storing //
    const meal = createNewMealFromRecipe(formValues);
    toast({
      title: `Meal saved`,
      description: ` A new meal have been added to your diary.`,
    });

    // Handles form reset and close //
    remove();
    form.reset();
    onSave();
  };

//----------------------------------- Recipe Selection and display ------------------------------//

  const [isRowSelected, setIsRowSelected] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeAndIngredients>();
  const [isRecipeEdited, setIsRecipeEdited] = useState<Boolean>(false)

  function handlesRowSelect(row : Row<TData>) {
    // @ts-ignore
    table.getColumn("name")?.setFilterValue(row.original.name);
    setIsFilterDisabled(true)
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
    table.getColumn("name")?.setFilterValue("");
    setIsFilterDisabled(false)
    setIsRecipeEdited(false)
  }

  function onEditRecipe(recipe : RecipeAndIngredients){
    setSelectedRecipe(recipe)
    setIsRecipeEdited(true)
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
            <FormItem>
              <FormLabel>Type of meal :</FormLabel>
              <Select onValueChange={field.onChange} defaultValue="snack">
                <FormControl>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Choose a type of meal"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="snack">Snack</SelectItem>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="diner">Diner</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col">
          <h2 className="scroll-m-20 border-b pb-2 text-sm font-medium tracking-tight first:mt-0">
              Select a recipe :
          </h2>
          <div className="flex flex-col">
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
              <ScrollArea className="overflow-y-scroll no-scrollbar rounded-md border max-h-80 w-full min-w-40 mb-11">
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
            <div className="flex flex-col gap-2 grow md:mt-5">
            <ScrollArea className="md:max-h-[400px]">
            {fields.map((fieldArray, index) => (
                <div  
                key={fieldArray.id}
                className="flex flex-col gap-8 p-2 justify-between"      
                >
                  <div className="text-sm mt-2 basis-1/3 flex">
                    {isRecipeEdited ? 
                        <div className="my-auto">
                        {selectedRecipe?.name} <span className="text-muted-foreground"> - Edited</span>
                      </div>
                    :
                    <div className="my-auto">
                      {selectedRecipe?.name}
                    </div>
                    }
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
                          placeholder="Quantity (1)"
                          required
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
                              <div className="text-sm min-w-[100px] my-auto ml-2 pb-2">
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
          </div>
        </div>
        <Button className="mt-auto mb-4 md:mb-0" type="submit">Create Meal</Button>
      </form>
    </Form>
    )
}

