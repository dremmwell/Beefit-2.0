import React from 'react'
import { getLatestSplit, getSplitWorkouts } from '@/app/actions/db.actions/workout.actions'
import { ExercicePerfs, Split } from '@prisma/client'

async function ProgressWrapper({userId} : {userId : string}) {

    const split : Split =  await getLatestSplit(userId)
    const workouts : ExercicePerfs[] = await getSplitWorkouts(userId, split)

    return (
        <>
            Progress
        </>
    )
}

export default ProgressWrapper
