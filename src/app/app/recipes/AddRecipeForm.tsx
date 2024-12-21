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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { AddRecipeFormSchema } from "@/app/types/form.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { v4 as uuidv4 } from 'uuid';
import { Recipe, RecipeIngredient } from "@prisma/client"
import { createRecipe } from "@/app/actions/db.actions/recipe.actions"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"


interface AddRecipeForm<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[],
  onSave: Function
}


export function createNewRecipe(values : z.infer<typeof AddRecipeFormSchema>){

    const uuid = uuidv4();

    let instructions : string = "";
    if(values.description == undefined){
        instructions = "";
    }
    else{
      instructions = values.description
    }

    const recipe : Recipe = {
        id : uuid,
        name: values.recipeName,
        instructions: instructions,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "",
        bookmarked: false,
        isOriginal: true
    }
    return recipe
}

export function createNewRecipeIngredientArray(values : z.infer<typeof AddRecipeFormSchema>, recipe : Recipe) {
    const recipeIngredients : Array<RecipeIngredient> = []
    values.ingredients.forEach(ingredient => {
        if(ingredient.quantity){
          const recipeIngredient : RecipeIngredient = {
            id: uuidv4(),
            recipeId: recipe.id,
            ingredientId: ingredient.ingredientid,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          recipeIngredients.push(recipeIngredient);
        }
    });
    return recipeIngredients
}


export default function AddRecipeForm<TData, TValue>({
  columns,
  data,
  onSave
}: AddRecipeForm<TData, TValue>) {

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
 
  const form = useForm<z.infer<typeof AddRecipeFormSchema>>({
    resolver: zodResolver(AddRecipeFormSchema),
    mode: "onBlur",
    defaultValues: {
      recipeName: "",
      description: "",
      ingredients: []
    }
    
  })

  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control: form.control,
  });

  let isSubmitting : boolean = form.formState.isSubmitting;
 
  async function onSubmit (formValues: z.infer<typeof AddRecipeFormSchema>) {
    try{
        //Handles data formatting and db storing //
        const recipe = createNewRecipe(formValues);
        const recipeIngredientArray = createNewRecipeIngredientArray(formValues, recipe);
        await createRecipe(recipe, recipeIngredientArray);
        toast({
          title: `Recipe "${recipe.name}" saved`,
          description: ` ${recipe.name} have been added to the database.`,
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

  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col mx-4 my-0 min-h-[500px]">
        <FormField 
          name="recipeName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel >
                Recipe Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Name..." required {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField 
          name="description" 
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel >
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Recipe intructions..." {...field}
                  className="w-full max-h-[200px] "
                /> 
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-col">
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
              <ScrollArea className="overflow-y-scroll md:overflow-y-hidden rounded-md border max-h-80 w-full min-w-40">
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
              <div className="flex-1 text-sm text-muted-foreground py-2">
                {table.getSelectedRowModel().rows.length} ingredient(s) selected. 
              </div>
            </div>
            <div className="flex flex-col gap-2 grow">
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
                        placeholder="Quantity..."
                        required
                        type="number"
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
        <Button disabled={isSubmitting} className="mt-auto mb-4 md:mb-0" type="button" onClick={form.handleSubmit(onSubmit)}>
          {isSubmitting && (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          )}
          Create
        </Button>
      </form>
    </Form>
    )
}

