"use client"
 
import { ColumnDef, Visibility } from "@tanstack/react-table";
import { Ingredient } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { DeleteButton } from "./deleteButton";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { EditFormDialog } from "./EditFormDialog";
import { DetailsButton } from "./detailsButton";



export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
          className="text-center md:text-left md:pl-8"
        >
          Name
        </div>
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
        className="md:pl-8"
        >
          Unit
        </div>
      )
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ingredient = row.original 

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex flex-col">
                <DetailsButton ingredient={ingredient}/> 
                <EditFormDialog ingredient={ingredient} />
              <DropdownMenuSeparator />
                <DeleteButton ingredient={ingredient} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]