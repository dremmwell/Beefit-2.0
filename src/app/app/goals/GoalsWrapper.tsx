import React from 'react'
import { getFocus, getLatestSplit, getStepGoal } from "@/app/actions/db.actions/workout.actions";
import PriorityBoard from "./PriorityBoard";
import { Split } from '@prisma/client';
import { DatePicker } from '@/components/DatePicker';
import { FocusLabels } from '@/app/types/definitions';
import StepGoal from './StepGoal';

async function GoalsWrapper({userId} : {userId : string}) {

    const focus : FocusLabels[] = await getFocus(userId);
    const split : Split = await getLatestSplit(userId)
    const stepGoal = await getStepGoal(userId)

  return (
    <>
      <div className="flex items-center lg:gap-4 gap-2 mt-1 mb-2 justify-between">
        <div className="flex items-center gap-2 flex-col lg:flex-row">
          <h1 className="text-sm lg:whitespace-nowrap">
            Current Split :
          </h1> 
          <DatePicker currentSplit={split} userId={userId} />
        </div>
        <div className="flex items-center gap-2 flex-col lg:flex-row">
          <h1 className="text-sm lg:whitespace-nowrap">
            Daily Steps :
          </h1> 
            <StepGoal userId={userId} stepGoal={stepGoal} />
        </div>
      </div>
      <PriorityBoard focus={focus} userId={userId} />
    </>
  )
}

export default GoalsWrapper