"use server"

import db from "@/db/db";
import { createIngredient } from "./ingredient.actions";
import { UserId } from "lucia";
import { revalidatePath } from 'next/cache'
import { placeholderFocus } from "@/lib/placeholders/focus";
import { placeholderLabels } from "@/lib/placeholders/labels";
import { placeholderGroups, placeholderExercises } from "@/lib/placeholders/placeholderExercises";
import { LABEL_COLORS } from "@/lib/goals_utils";

const EXERCISE_TEMPLATE_PERF_DATE = new Date("1970-01-01T00:00:00.000Z")

//----------------------------------------- Seeding Database ------------------------------------//

export async function seedDB(userId : UserId) {
  await seedLabelsAndFocus(userId)
  await seedExercisesGroups(userId)
  await seedExercises(userId)
  revalidatePath("/app")
}

export async function seedLabelsAndFocus(userId : UserId){
  const focusSeedData = placeholderFocus as Array<{ name: string; priority: string | number }>
  const labelSeedData = placeholderLabels as Array<{ name: string }>

  await db.$transaction(async (tx) => {
    await tx.objective.create({
      data: {
        userId: userId,
      },
    })

    await tx.split.create({
      data: {
        userId,
        startDate: new Date(),
        length: 7,
      },
    })

    const createdFocus = await Promise.all(
      focusSeedData.map((focus) =>
        tx.focus.create({
          data: {
            name: focus.name,
            priority: String(focus.priority),
            userId,
          },
        }),
      ),
    )

    if (createdFocus.length === 0 || labelSeedData.length === 0) {
      return
    }

    const focusByName = new Map(createdFocus.map((focus) => [focus.name, focus.id]))
    const defaultFocusId = focusByName.get("Default") ?? createdFocus[0].id

    await tx.labels.createMany({
      data: labelSeedData.map((label, index) => ({
        name: label.name,
        color: LABEL_COLORS[index % LABEL_COLORS.length].value,
        userId,
        focusId: defaultFocusId,
      })),
    })
  })
}

export async function seedIngredients(userId : UserId, ingredients : any){
  ingredients.forEach((ingredient : any) => {
    createIngredient(ingredient)
  });
}

export async function seedExercisesGroups(userId: UserId) {
  const exerciseGroupSeedData = placeholderGroups as Array<{ name: string; order: number }>

  if (exerciseGroupSeedData.length === 0) {
    return
  }

  await db.exerciceGroup.createMany({
    data: exerciseGroupSeedData.map((group) => ({
      name: group.name,
      order: group.order,
      userId,
    })),
  })
}

export async function seedExercises(userId: UserId) {
  const exerciseSeedData = placeholderExercises as Array<{
    name: string
    group: string
    label: Array<{ name: string; value: number }>
  }>

  if (exerciseSeedData.length === 0) {
    return
  }

  // Get all groups for this user, keyed by name
  const userGroups = await db.exerciceGroup.findMany({
    where: { userId },
  })
  const groupByName = new Map(userGroups.map((group) => [group.name, group.id]))

  // Get all labels for this user, keyed by name
  const userLabels = await db.labels.findMany({
    where: { userId },
  })
  const labelByName = new Map(userLabels.map((label) => [label.name, label.id]))

  // Track exercise order within each group
  const exerciseOrderByGroup = new Map<string, number>()

  for (const exercise of exerciseSeedData) {
    // Get the group ID for this exercise
    const groupId = groupByName.get(exercise.group)
    if (!groupId) {
      console.warn(`Skipping exercise "${exercise.name}": Group "${exercise.group}" not found`)
      continue
    }

    // Verify all labels exist
    const missingLabels = exercise.label.filter((label) => !labelByName.has(label.name))
    if (missingLabels.length > 0) {
      console.warn(
        `Skipping exercise "${exercise.name}": Missing labels: ${missingLabels.map((l) => l.name).join(", ")}`
      )
      continue
    }

    // Get the next order index for this group
    const groupOrder = exerciseOrderByGroup.get(exercise.group) ?? 0
    exerciseOrderByGroup.set(exercise.group, groupOrder + 1)

    // Create the exercise
    const createdExercise = await db.exercice.create({
      data: {
        name: exercise.name,
        description: "",
        userId,
        exerciceGroupId: groupId,
        groupOrder,
      },
    })

    // Create the exercise labels
    const labelLinksToCreate = exercise.label
      .map((label) => {
        // Convert numeric weight to label role: 1 → "primary", 0.5 → "secondary"
        const labelRole = label.value === 1 ? "primary" : "secondary"
        return {
          exerciceId: createdExercise.id,
          labelId: labelByName.get(label.name)!,
          value: labelRole,
        }
      })

    if (labelLinksToCreate.length > 0) {
      await db.execiceLabels.createMany({
        data: labelLinksToCreate,
      })
    }

    // Create template exercise performance entry
    await db.exercicePerfs.create({
      data: {
        exerciceId: createdExercise.id,
        userId,
        sets: 4,
        reps: 8,
        weights: 20,
        unit: "kg",
        notes: "",
        createdAt: EXERCISE_TEMPLATE_PERF_DATE,
      },
    })
  }
}


