import Table from "./Table"
import { fetchIngredient } from "@/lib/data";
import { columns } from "./columns";

export default async function Page() { 
  
  const ingredientsData = await fetchIngredient();

  return (
    <div className="container mx-auto py-10 flex flex-1">
      <Table columns={columns} data={ingredientsData}/>
    </div>
  )
}
