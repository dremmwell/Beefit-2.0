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
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState, useEffect } from "react"

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
  const [rowSelection, setRowSelection] = React.useState({})

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

return (
  <form className="flex flex-col mx-4 my-0 min-h-[500px]">
    <div className="flex gap-2 items-center">
      <Label htmlFor="name" className="basis-1/3">
        Recipe Name
      </Label>
      <Input id="name" placeholder="Name..." className="col-span-3" />
    </div>
    <div className="mb-auto">
    <div className="flex gap-4">
    <div className="min-h-[300px] min-w-[300px] w-full flex flex-col">
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
          <ScrollArea className="rounded-md border max-h-80 w-full">
              <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                          return (
                          <TableHead key={header.id}>
                              {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                  )}
                          </TableHead>
                          )
                      })}
                      </TableRow>
                  ))}
                  </TableHeader>
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
            <div className="my-6 min-w-[300px]">
            <h2 className="scroll-m-20 border-b pb-2 text-sm font-semibold tracking-tight first:mt-0">
                Selected Ingredients :
            </h2>
            <div className="max-h-[350px] overflow-y-scroll no-scrollbar">                  
              {table.getSelectedRowModel().rows.map(row => (
                  <div key={row.id} className="flex gap-2 items-center my-2">
                    <Label htmlFor="qty" className="flex-1">
                      {row.original.name}
                    </Label>
                    <Input type="number" id="qty" placeholder="quantity..." className="max-w-28" />
                    <h3 className="text-sm font-medium">grams</h3>
                  </div>
                ))
              }
            </div>
          </div>
        } 
      </div>
    </div>
    <Button className="mt-auto" type="submit">Create</Button>
  </form>

  )
}

