'use client'

import {
    ColumnDef,
  } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { useEffect, useState } from "react";
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";
import { getIngredients } from "@/lib/ingredients_utils";

interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

export default function Table<TData, TValue>({
    columns,
}: TableProps<TData, TValue>) {

  const [isShorted, setIsShorted] = useState(false);
  const { height, width } = useWindowDimensions();
  const [ingredients, setIngredients ] = useState([]);

  // Get ingredients data from api/ingredients
  
  useEffect(() => {
    async function fetchData() {
      const data = await getIngredients();
      setIngredients(data);
    }
    fetchData();
 }, []);


// Get windows dimensions and set isShorted true/false
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