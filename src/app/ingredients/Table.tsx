'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from "@tanstack/react-table"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";
import { fetchIngredient, getIngredients } from "@/lib/data";
import { Ingredient } from "@/lib/definitions";

interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

export default function Table<TData, TValue>({
    columns,
}: TableProps<TData, TValue>) {

  const [isShorted, setIsShorted] = useState(false);
  const { height, width } = useWindowDimensions();
  const [ingredients, setIngredients ] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getIngredients();
      setIngredients(data);
    }

    fetchData();
 }, []);

  const shortWidth = 920;

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
    <div className="overflow-hidden container flex px-0.5">
      <DataTable columns={columns} data={ingredients} isShorted={isShorted}/>
    </div>
  )
}