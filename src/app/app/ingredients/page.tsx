import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

import Table from "./Table"
import { columns } from "./columns";

import { getIngredients, createIngredient } from "../../actions/db.actions/ingredient.actions";


/* import { placeholderIngredients } from '../../../lib/placeholder-data'
placeholderIngredients.forEach(ingredient => {
  //@ts-ignore
  createIngredient(ingredient)
}) */


export default async function Page() { 

  // Validating Path if valid user // 
  const { user } = await validateRequest()
  if(!user) {
    return redirect("/")
  }

const ingredients = await getIngredients(user.id);

  return (
    <>
      <div className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Ingredients</h1>
        <Table columns={columns} data={ingredients}/>
      </div>
    </>
  )
}
