import { getLatestSplit } from '@/app/actions/db.actions/workout.actions'
import React from 'react'

async function ProgressWrapper({userId} : {userId : string}) {

    const split =  await getLatestSplit(userId)

    return (
        <>
            Progress
        </>
    )
}

export default ProgressWrapper
