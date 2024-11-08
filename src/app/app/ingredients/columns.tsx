"use client"
 
import { ColumnDef, Visibility } from "@tanstack/react-table";
import { Ingredient } from '@prisma/client'
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { DataTableRowActions } from "./data-table-row-actions";


export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
      <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-auto md:ml-4"
        >
          Name
          <ArrowUpDown className="text-center md:ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "calories",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Calories
          <ArrowUpDown className="text-center md:text-left md:ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "proteins",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Proteins
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "carbs",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Carbs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "fats",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fats
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return (
        <div
        className="md:pl-4"
        >
          Unit
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]