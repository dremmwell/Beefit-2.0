import React from 'react'
import { getFocus, getLatestSplit } from "@/app/actions/db.actions/workout.actions";
import PriorityBoard from "./PriorityBoard";
import { Focus, Split } from '@prisma/client';
import { DatePicker } from '@/components/DatePicker';
import { FocusLabels } from '@/app/types/definitions';

async function GoalsWrapper({userId} : {userId : string}) {

    const focus : FocusLabels[] = await getFocus(userId);
    const split : Split = await getLatestSplit(userId)

  return (
    <>
      <div className="flex items-center lg:gap-4 gap-2 mt-1 mb-2">
        <h1 className="text-sm whitespace-nowrap">
          Current Split :
        </h1>
        <DatePicker currentSplit={split} userId={userId} />
      </div>
      <PriorityBoard focus={focus} userId={userId} />
    </>
  )
}

export default GoalsWrapper