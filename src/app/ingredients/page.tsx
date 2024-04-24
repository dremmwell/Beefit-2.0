import Table from "./Table"
import { columns } from "./columns";
import { IngredientFormDialog } from "./IngredientFormDialog";

export default async function Page() { 

  return (
    <>
      <div className="container my-10 flex flex-col gap-2">
        <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Ingredients</h1>
        <Table columns={columns}  />
        <IngredientFormDialog /> {/*handles the form and the add button*/}
      </div>
    </>
  )
}
