import React from 'react'
import ExerciceBoard from "./ExerciceBoard";
import { getExerciceGroups, getExerciceData, getLabels } from "@/app/actions/db.actions/workout.actions";
import { ExerciceGroup } from "@prisma/client";
import { Labels } from "@prisma/client";


async function ExerciseWrapper({userId} : {userId : string}) {

    const groups : Array<ExerciceGroup> = await getExerciceGroups(userId);
    const exercicesData = await getExerciceData(userId);
    const labels : Array<Labels> = await getLabels(userId);

  return (
    <>
        <ExerciceBoard groups={groups} exercicesData={exercicesData} labels={labels} userId={userId} />
    </>
  )
}

export default ExerciseWrapper
