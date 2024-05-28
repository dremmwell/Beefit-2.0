'use client'

import {
    ColumnDef,
  } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";

import { getIngredients } from "@/lib/ingredients_utils";

interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

export default function Table<TData, TValue>({
    columns,
}: TableProps<TData, TValue>) {


  const [ingredients, setIngredients ] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get ingredients data from api/ingredients
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getIngredients();
      setIngredients(data);
      setIsLoading(false);
    }
    fetchData();
 }, []);

  return (
    <div className="overflow-hidden flex px-0.5">
      <DataTable columns={columns} data={ingredients} isLoading={isLoading}/>
    </div>
  )
}