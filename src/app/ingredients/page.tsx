import { fetchIngredient } from "@/lib/data";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Ingredient } from "@/lib/definitions";


export default async function Page() {
  const ingredientsData = await fetchIngredient();

  return (
    <div className="overflow-auto container mx-auto py-10 flex flex-1">
      <DataTable columns={columns} data={ingredientsData} />
    </div>
  )
}