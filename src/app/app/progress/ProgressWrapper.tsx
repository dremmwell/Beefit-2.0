import React from 'react'
import { getFocus, getLatestSplit, getSplitWorkouts } from '@/app/actions/db.actions/workout.actions'
import { ExercicePerfs, Split, Focus } from '@prisma/client'
import ProgressBlock from './ProgressBlock'
import SplitDays from './SplitDays'


async function ProgressWrapper({userId} : {userId : string}) {

    const split : Split =  await getLatestSplit(userId)
    const workouts : ExercicePerfs[] = await getSplitWorkouts(userId, split)
    const focus : Focus[] = await getFocus(userId)

    return (
      <>
        <div className="flex flex-col lg:gap-4 gap-2 lg:flex-row overflow-y-scroll lg:overflow-y-visible lg:overflow-x-auto pb-4 no-scrollbar lg:flex-wrap">
          <SplitDays split={split} />
          <ProgressBlock workouts={workouts} focus={focus} />
        </div>
      </>
  )
}

export default ProgressWrapper
