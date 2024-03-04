"use client"
 
import { ColumnDef } from "@tanstack/react-table";
import { Ingredient } from "@/lib/definitions";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
 
 
export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "per",
    header: "Unit",
  },
  {
    accessorKey: "calories",
    header: "Calories",
  },
  {
    accessorKey: "proteins",
    header: "Proteins",
  },
  {
    accessorKey: "carbs",
    header: "Carbs",
  },
  {
    accessorKey: "fats",
    header: "Fats",
  },

  {
    id: "actions",
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
            <DropdownMenuItem>Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem              
                onClick={() => navigator.clipboard.writeText(ingredient.id)}>Update Ingredient</DropdownMenuItem>
            <DropdownMenuItem>Delete Ingredient</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]