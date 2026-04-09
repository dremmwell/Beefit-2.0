import React from 'react'
import { getFocus, getLatestSplit, getSplitWorkouts } from '@/app/actions/db.actions/workout.actions'
import { Split, Focus } from '@prisma/client'
import { SplitWorkoutData } from '@/app/types/definitions'
import ProgressBlock from './ProgressBlock'
import SplitDays from './SplitDays'


async function ProgressWrapper({userId} : {userId : string}) {

  const split : Split =  await getLatestSplit(userId)
  const workouts : SplitWorkoutData[] = await getSplitWorkouts(userId, split)
  const foci : Focus[] = await getFocus(userId)

    return (
        <>
          <SplitDays split={split} />
          <div className='flex flex-col lg:gap-4 gap-2 lg:flex-row overflow-y-scroll lg:overflow-y-visible lg:overflow-x-auto pb-4 no-scrollbar lg:flex-wrap'>
            {[...foci].sort((a, b) => Number(b.priority) - Number(a.priority)).map((focus) => {
              const focusWorkouts = workouts.filter((workout) =>
                workout.Exercice.execiceLabels.some((el) => el.Labels.Focus.id === focus.id)
              )
              return <ProgressBlock key={focus.id} focus={focus} workouts={focusWorkouts} />
            })}
          </div>
        </>
  )
}

export default ProgressWrapper
