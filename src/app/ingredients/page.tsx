import { fetchIngredient } from "@/lib/data";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Ingredient } from "@/lib/definitions";


export default async function Page() {
  const ingredientsData = await fetchIngredient();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={ingredientsData} />
    </div>
  )
}