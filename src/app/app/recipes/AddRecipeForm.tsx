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


interface AddRecipeForm<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  data: TData[]
}

export default function AddReciepForm<TData, TValue>({
  columns,
  data
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

  const onSubmit = (formValues: z.infer<typeof AddRecipeFormSchema>) => {
    console.log(formValues);
    remove();
    form.reset();
  };

  function handlesRowSelect(row : Row<TData>) {
    if(!row.getIsSelected()){
      row.toggleSelected(true)
      append({
        quantity: "",
         // @ts-ignore
        unit: row.original.unit,
        // @ts-ignore
        name: row.original.name,
        // @ts-ignore
        ingredientid: row.original.id,
        rowid: row.id, 
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
            <div className="md:min-h-[300px] md:min-w-[300px] w-full flex flex-col gap-2 mt-2 max-w-[400px] grow-0">
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
            <ScrollArea className="max-h-[400px] mx-2">
            {fields.map((fieldArray, index) => (
                <div  
                key={fieldArray.id}
                className="flex gap-2 p-2"      
                >
                  <FormField 
                  control={form.control}
                  name={`ingredients.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex items-center mb-0 gap-2">
                      <FormLabel className="mt-2 grow">
                        {fieldArray.name}
                      </FormLabel>
                      <FormControl>
                        <Input 
                        {...field} 
                        className="min-w-[100px]"
                        placeholder="Quantity..."
                        required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  />
                  {fieldArray.unit === "100g" ?
                  <div className="flex items-center mt-2">
                    <div className="text-sm">grams</div>
                  </div>
                   :
                    <FormField 
                    control={form.control}
                    name={`ingredients.${index}.unit`}
                    render={({ field }) => (
                        <FormItem className="mb-0 flex items-center mt-2">
                          <Select onValueChange={field.onChange} defaultValue="grams">
                            <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a unit" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="grams">grams</SelectItem>
                              <SelectItem value={fieldArray.unit}>{fieldArray.unit}</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                    )}
                    />
                  }
                  <div className="flex items-center mt-2">
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

/* {table.getSelectedRowModel().rows.length > 0 && 
  <div className="my-2 min-w-[300px]">
  <ScrollArea className="max-h-[400px] overflow-y-scroll no-scrollbar mx-2">                  
    {table.getSelectedRowModel().rows.map(row => (
        <div key={row.id} className="flex gap-2 items-center my-2 mx-2">
          <Label htmlFor="qty" className="flex-1">
            {row.original.name}
          </Label>
          <Input type="number" id="qty" placeholder="quantity..." className="max-w-28" />
          <h3 className="text-sm font-medium">grams</h3>
        </div>
      ))
    }
  </ScrollArea>
</div>
}  */

