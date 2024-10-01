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
import { Trash2 } from "lucide-react"
import IconMenu from "@/components/icon-menu"
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
    console.log("clicked")
    console.log(formValues);
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

  function handlesDelete(index :any, id : string){
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
            <div className="md:min-h-[300px] md:min-w-[300px] w-full flex flex-col gap-2 mt-2">
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
              {fields.map((field, index) => (
              <div key={field.id}>
                <FormItem>
                  <FormLabel>
                    {field.name}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Quantity..."
                      required {...field}
                      className="w-full"
                      type="number"
                      min="0"
                    /> 
                  </FormControl>
                  <button
                    onClick={() => handlesDelete(index, "0")}
                    className="w-full justify-start flex rounded-md p-2"
                  >
                    <IconMenu
                      text=""
                      icon={<Trash2 className="h-4 w-4" />}
                    />
                  </button>
                </FormItem>
              </div>
            ))}
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

