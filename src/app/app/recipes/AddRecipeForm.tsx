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
  RowSelectionState
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

export default function IngredientsTable<TData, TValue>({
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
      name: "",
      description: "",
      ingredients: []
    }
  })

  const { fields, append } = useFieldArray({
    name: "ingredients",
    control: form.control,
  });

  const onSubmit = (data: z.infer<typeof AddRecipeFormSchema>) => {
    console.log(data);
  };

return (
  <Form {...form}>
    <form 
    action=""
    onSubmit={form.handleSubmit(onSubmit)}
    className="flex flex-col mx-4 my-0 min-h-[500px]">
      <FormField 
        name="name" 
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel >
              Recipe Name
            </FormLabel>
            <FormControl>
              <Input 
              placeholder="Name..."
              type="text"
              className="w-full"
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
                placeholder="Recipe intructions..."
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
          <div className="md:min-h-[300px] md:min-w-[300px] w-full flex flex-col">
            <div className="flex items-center py-4">
              <Input
                id="filterInput"
                placeholder="Search ingredients..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm mr-4"
              />
              </div>
                <ScrollArea className="overflow-y-scroll md:overflow-y-hidden rounded-md border max-h-80 w-full min-w-40">
                    <Table >
                        <TableBody>
                        { table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                          <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
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
                          <TableCell colSpan={columns.length} className="h-24 text-center">
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
              {table.getSelectedRowModel().rows.length > 0 && 
                <div className="my-2 min-w-[300px]">
                <ScrollArea className="max-h-[400px] overflow-y-scroll no-scrollbar mx-2">                  
                  {table.getSelectedRowModel().rows.map(row => (
                      <div key={row.id} className="flex gap-2 items-center my-2 mx-2">
                        <Label htmlFor="qty" className="flex-1">
                          {/* 
                          // @ts-ignore */}
                          {row.original.name}
                        </Label>
                        <Input type="number" id="qty" placeholder="quantity..." className="max-w-28" />
                        <h3 className="text-sm font-medium">grams</h3>
                      </div>
                    ))
                  }
                </ScrollArea>
              </div>
            } 
        </div>
      </div>
      <Button className="mt-auto" type="submit">Create</Button>
    </form>
  </Form>
  )
}

