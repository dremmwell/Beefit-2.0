import React from 'react'
import { getFocus } from "@/app/actions/db.actions/workout.actions";
import PriorityBoard from "./PriorityBoard";

async function GoalsWrapper({userId} : {userId : string}) {

    const focus = await getFocus(userId);

  return (
        <PriorityBoard focus={focus} userId={userId} />
  )
}

export default GoalsWrapper
