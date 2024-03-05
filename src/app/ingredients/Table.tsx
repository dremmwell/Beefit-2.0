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
    <div className="overflow-hidden container mx-auto py-10 flex flex-1 px-0 lg:px-7">
      <DataTable columns={columns} data={data} isShorted={isShorted}/>
    </div>
  )
}