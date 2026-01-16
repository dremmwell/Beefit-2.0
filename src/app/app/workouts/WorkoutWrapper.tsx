import React from 'react'
import WorkoutTabs from "./WorkoutTabs"
import { User } from 'lucia'
import { getFocus } from '@/app/actions/db.actions/workout.actions'
import { Focus } from '@prisma/client'
import { FocusLabels } from '@/app/types/definitions'

async function WorkoutWrapper( {user} : {user : User}) {

    const focus : Array<FocusLabels> = await getFocus(user.id)

    return (<WorkoutTabs focus={focus} />)
}

export default WorkoutWrapper
