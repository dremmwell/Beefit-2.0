import { DataTable } from "./data-table"
import { columns } from "./columns";
import { getIngredients, createIngredient } from "../../actions/db.actions/ingredient.actions"
import { User } from "lucia";
;


export default async function Table({user}: {user : User}) {

  const ingredients = await getIngredients(user.id);

  return (
    <div className="overflow-hidden flex px-0.5">
        <DataTable columns={columns} data={ingredients} isLoading={false}/>
    </div>
  )
}