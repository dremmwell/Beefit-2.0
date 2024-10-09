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
import { Recipe, RecipeIngredient } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"


interface MealrecipesForm<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[],
  onSave: Function
}


export function createNewMealFromRecipe(values : z.infer<typeof MealRecipeSchema>){
    console.log(values)
}

export default function MealRecipeForm<TData, TValue>({
  columns,
  data,
  onSave
}: MealrecipesForm<TData, TValue>) {


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

  const { toast } = useToast()
 
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

  async function onSubmit (formValues: z.infer<typeof MealRecipeSchema>) {

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

  const [isRowSelected, setIsRowSelected] = useState(false)

  function handlesRowSelect(row : Row<TData>) {
    // @ts-ignore
    table.getColumn("name")?.setFilterValue(row.original.name)
    if(!row.getIsSelected()){
        if(!isRowSelected){
            setIsRowSelected(true) 
            row.toggleSelected(true)
            append({
              quantity: "",
               // @ts-ignore
              unit: "grams",
              // @ts-ignore
              name: row.original.name,
              // @ts-ignore
              recipeid: row.original.id,
              rowid: row.id, 
              // @ts-ignore
              gramsPerUnit: row.original.gramsPerUnit,
              // @ts-ignore
              recipeUnit: row.original.unit
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
  }

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
            <div className="md:min-w-[300px] w-full flex flex-col gap-2 mt-2 grow-0 max-w-96">
                <Input
                  id="filterInput"
                  placeholder="Search recipes..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
              <ScrollArea className="overflow-y-scroll md:overflow-y-hidden rounded-md border max-h-80 w-full min-w-40 mb-11">
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
                  name={`recipe.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex items-center mb-0 gap-2">
                      <FormControl>
                        <Input 
                        {...field} 
                        className="w-[100px] justify-end"
                        placeholder="Quantity..."
                        required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  {fieldArray.recipeUnit === "100g" ?
                  <div className="flex items-center">
                    <div className="text-sm">grams</div>
                  </div>
                   :
                    <FormField 
                    control={form.control}
                    name={`recipe.${index}.unit`}
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
                              <SelectItem value={fieldArray.recipeUnit}>{fieldArray.recipeUnit}(s)</SelectItem>
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
        <Button className="mt-auto" type="submit">Create</Button>
      </form>
    </Form>
    )
}

