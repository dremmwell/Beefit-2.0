import React from 'react'
import { getFocus, getLatestSplit, getSplitWorkouts } from '@/app/actions/db.actions/workout.actions'
import { Split } from '@prisma/client'
import { FocusLabels, SplitWorkoutData } from '@/app/types/definitions'
import ProgressBlock from './ProgressBlock'
import SplitDays from './SplitDays'


async function ProgressWrapper({userId} : {userId : string}) {

  const split : Split =  await getLatestSplit(userId)
  const workouts : SplitWorkoutData[] = await getSplitWorkouts(userId, split)
  const foci : FocusLabels[] = await getFocus(userId)

    return (
        <>
          <SplitDays split={split} />
          <div className='flex flex-col overflow-y-scroll pb-4 no-scrollbar gap-2 lg:w-1/2'>
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
