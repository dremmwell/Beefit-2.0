import {
    ColumnDef,
  } from "@tanstack/react-table"
import { DataTable } from "./data-table"


interface TableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

export default function Table<TData, TValue>({
    columns,
    data
}: TableProps<TData, TValue>) {

  return (
    <div className="overflow-hidden flex px-0.5">
      <DataTable columns={columns} data={data} isLoading={false}/>
    </div>
  )
}