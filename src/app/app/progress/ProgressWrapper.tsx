import React from 'react'
import { getFocus, getLatestSplit, getSplitWorkouts } from '@/app/actions/db.actions/workout.actions'
import { Split } from '@prisma/client'
import { FocusLabels, SplitWorkoutData } from '@/app/types/definitions'
import ProgressBlock from './ProgressBlock'
import SplitDays from './SplitDays'
import ProgresExercises from './ProgressExercises'


async function ProgressWrapper({userId} : {userId : string}) {

  const split : Split =  await getLatestSplit(userId)
  const workouts : SplitWorkoutData[] = await getSplitWorkouts(userId, split)
  const foci : FocusLabels[] = await getFocus(userId)

    return (
      <div className='flex min-h-0 flex-col gap-2 lg:flex-row overflow-y-auto no-scrollbar'>
        <div className='flex flex-col flex-1 lg:overflow-y-auto no-scrollbar'>
          <SplitDays split={split} />
          <div className='flex flex-col gap-2 overflow-y-auto lg:pb-4 no-scrollbar'>
            {[...foci].sort((a, b) => Number(b.priority) - Number(a.priority)).map((focus) => {
              const focusWorkouts = workouts.filter((workout) =>
                workout.Exercice.execiceLabels.some((el) => el.Labels.Focus.id === focus.id)
              )
              return <ProgressBlock key={focus.id} focus={focus} workouts={focusWorkouts} />
            })}
          </div>
        </div>
        <ProgresExercises workouts={workouts} split={split} userId={userId} />
      </div>
  )
}

export default ProgressWrapper
