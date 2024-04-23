import Table from "./Table"
import { fetchIngredient } from "@/lib/data";
import { columns } from "./columns";
import { IngredientFormDialog } from "./IngredientFormDialog";
import { Ingredient } from "@/lib/definitions";

export default async function Page() { 
  
  const ingredientsData = await fetchIngredient();

  return (
    <>
      <div className="container my-10 flex flex-col gap-2">
        <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Ingredients</h1>
        <Table columns={columns} data={ingredientsData} />
        <IngredientFormDialog />
      </div>
    </>
  )
}
