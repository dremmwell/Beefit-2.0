"use client"
 
import { ColumnDef, Visibility } from "@tanstack/react-table";
import { Ingredient } from '@prisma/client'
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"


export const columns: ColumnDef<Ingredient>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    )
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
        className="md:pl-8"
        >
          Ingredient Name
        </div>
      )
    },
  }
]