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

interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function Table<TData, TValue>({
    columns,
    data,
}: TableProps<TData, TValue>) {

  const [isShorted, setIsShorted] = useState(false);
  const { height, width } = useWindowDimensions();

  const smWidth = 640;

  useEffect(() => {
    if (typeof width !== 'undefined') {
      if (width <= smWidth) {
        setIsShorted(true);
      }
      else {
        setIsShorted(false);
      }
    }
  }, [width]);


  return (
    <div className="overflow-auto container mx-auto py-10 flex flex-1">
      <DataTable columns={columns} data={data} shorted={isShorted}/>
    </div>
  )
}