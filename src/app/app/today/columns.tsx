"use client"
 
import { ColumnDef, Visibility } from "@tanstack/react-table";
import { Ingredient, Recipe } from '@prisma/client'


export const columnsIngredients: ColumnDef<Ingredient>[] = [
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

export const columnsRecipes: ColumnDef<Recipe>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div
        className="md:pl-8"
        >
          Recipe Name
        </div>
      )
    },
  }
]