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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { useState, useEffect } from "react"
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [isShorted, setIsShorted] = useState(false);
  const { height, width } = useWindowDimensions();

  const table = useReactTable({
    data,
    columns,
    initialState: {
      columnVisibility: {
        carbs: !isShorted,
        proteins: !isShorted,
        fats: !isShorted,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  useEffect(() => {
    table.setColumnVisibility({
      per: !isShorted,
      carbs: !isShorted,
      proteins: !isShorted,
      fats: !isShorted,
    });
 }, [isShorted, table]);


 // Get windows dimensions and set isShorted true/false
 const shortWidth = 1054;

 useEffect(() => {
   if (typeof width !== 'undefined') {
     if (width <= shortWidth) {
       setIsShorted(true);
     }
     else {
       setIsShorted(false);
     }
   }
 }, [width]);


  return (
    <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            id="filterInput"
            placeholder="Filter ingredients..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <ScrollArea className="rounded-md border h-5/6">
            <div>
            <Table>
                <TableHeader>
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
                {isLoading ? ( 
                  <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                      Loading ingredients...
                  </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
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
            </div>
        </ScrollArea>
    </div>
  )
}