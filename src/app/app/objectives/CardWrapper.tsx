import React from 'react'
import CaloriesGoalCard from "./CaloriesGoalCard";
import MacroGoalCard from "./MacroGoalCard";
import { getLatestObjective } from "@/app/actions/db.actions/objective.actions";
import { User } from 'lucia';

async function CardWrapper({user} : {user : User}) {

const objective = await getLatestObjective(user.id);

  return (
    <div className='flex flex-col gap-2 flex-1'>
        <CaloriesGoalCard objective={objective} />
        <MacroGoalCard objective={objective} />
    </div>
  )
}

export default CardWrapper
