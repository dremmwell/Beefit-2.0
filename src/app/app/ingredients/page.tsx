import Table from "./Table"
import { columns } from "./columns";
import { AddFormDialog } from "./AddFormDialog";

import db from "@/db/db";
import { Ingredient } from "@/lib/definitions";
import { getIngredients } from "../../actions/db.actions";

export default async function Page() { 

const ingredients = await getIngredients();

  return (
    <>
      <div className="container sm:my-10 my-5 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Ingredients</h1>
        <Table columns={columns} data={ingredients}/>
        <AddFormDialog /> {/*handles the form and the add button*/}
      </div>
    </>
  )
}
