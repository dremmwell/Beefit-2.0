import Table from "./Table"
import { fetchIngredient } from "@/lib/data";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { DialogIngredients } from "./Dialog";

export default async function Page() { 
  
  const ingredientsData = await fetchIngredient();

  return (
    <div className="container my-10 flex flex-col">
      <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Ingredients</h1>
      <Table columns={columns} data={ingredientsData} />
      <DialogIngredients />
    </div>
  )
}
