import Table from "./Table"
import { fetchIngredient } from "@/lib/data";
import { columns } from "./columns";

export default async function Page() { 
  
  const ingredientsData = await fetchIngredient();

  return (
    <div className="container lg:mx-auto py-7 px-3 md:px-10 flex flex-1 ">
      <Table columns={columns} data={ingredientsData}/>
    </div>
  )
}
