"use server"

import db from "@/db/db";
import { ExerciceGroup, Focus, Labels, Prisma, Split } from "@prisma/client";
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'
import { ExerciceData, ExercicePerfInput } from "@/app/types/definitions";

type ExercicePositionUpdate = {
    exerciceId: string
    groupOrder: number
    groupId: string
}

type ExerciceGroupOrderUpdate = {
    groupId: string
    name: string
    order: number
}

type ExerciceLabelAssignmentInput = {
    labelId: string
    value: "primary" | "secondary"
}

type LabelInput = {
    id: string
    name: string
    color: string
    userId: string
    focusId: string
    createdAt: Date
    sets?: number | null
}

type CreateExerciceInput = {
    name: string
    description: string
    groupId: string
    groupOrder: number
    sets: number
    reps: number
    weight: number
    labels: ExerciceLabelAssignmentInput[]
}

type UpdateExerciceInput = {
    name: string
    description: string
    sets: number
    reps: number
    weight: number
    labels: ExerciceLabelAssignmentInput[]
}

//------------------- Focus Actions -------------------//

export async function getFocus(userId: UserId) {
    const data = await db.focus.findMany({
        where: {
            userId: userId,
        },
        include:{
            labels :true,
        },
    });
    const focusItems = JSON.parse(JSON.stringify(data));
    return focusItems
}

export async function createFocus(userId: UserId, focus : Focus) {
    const { user } = await validateRequest()
    if(user) {
        await db.focus.create({
            data: focus
        })
    }
}

export async function deleteFocus(userId: UserId, focusId: string) {
    const { user } = await validateRequest()
    if(user){
        if(user.id === userId){ 
            await db.focus.delete({
                where: {
                    id: focusId,
                }
            })
        }
    } 
}

export async function updateFocus(userId: UserId, focusId: string, focusName: string, focusPriority: string) {
    const { user } = await validateRequest()
    if(user) {
        await db.focus.update({
            where: {
                id: focusId,
            },
            data: {
                name: focusName,
                priority: focusPriority,
            },
        })
    }
}

//------------------- Labels Actions -------------------//

export async function getLabels(userId: UserId) {
    const data = await db.labels.findMany({
        where: {
            userId: userId,
        },
    });
    const labels : Array<Labels>= JSON.parse(JSON.stringify(data));
    return labels
}

export async function createLabel(userId: UserId, label :LabelInput) {
    const { user } = await validateRequest()
    if(user) {
        await db.labels.create({
            data: {
                id: label.id,
                name: label.name,
                color: label.color,
                sets: label.sets,
                userId: userId,
                focusId: label.focusId,
                createdAt: label.createdAt,
            },
        })
        revalidatePath("/app/exercises")
    }
}

export async function updateLabel(userId: UserId, label : Labels, focusId: string) {
    const { user } = await validateRequest()
    if(user) 
        if(user.id === userId){
            await db.labels.update({
                where: {
                    id: label.id,
                },
                data: {
                    focusId: focusId,
                },
            })
            revalidatePath("/app/exercises")
    }
    return
}

export async function editLabel(userId: UserId, labelId: string, name: string, color: string, sets: number | null) {
    const { user } = await validateRequest()
    if(user) {
        await db.labels.update({
            where: {
                id: labelId,
            },
            data: {
                name: name,
                color: color,
                sets: sets,
            },
        })
        revalidatePath("/app/exercises")
    }
    return
}

export async function deleteLabel(userId: UserId, labelId: string) {
    const { user } = await validateRequest()
    if(user){
        if(user.id === userId){ 
            await db.labels.delete({
                where: {
                    id: labelId,
                }
            })
            revalidatePath("/app/exercises")
        }
    }
}

//------------------- Exercise Actions -------------------//

export async function getExerciceGroups(userId: UserId) {
    const data = await db.exerciceGroup.findMany({
        where: {
            userId: userId,
        },
    });
    const exerciceGroups : Array<ExerciceGroup>= JSON.parse(JSON.stringify(data));
    return exerciceGroups
}

export async function getExerciceData(userId: UserId) {
    const data = await db.exercice.findMany({
        where: {
            userId: userId,
        },
        include: {
            execiceLabels: {
                include: {
                    Labels: true,
                }
            },
            perfs: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    });

    const exercices : ExerciceData[] = JSON.parse(JSON.stringify(
        data.map((exercice) => ({
            ...exercice,
            exercicePerfs: exercice.perfs,
        })),
    ));

    return exercices    
}

export async function createExerciceGroup(userId: UserId, group : ExerciceGroup) {
    const { user } = await validateRequest()
    if(user) {
        await db.exerciceGroup.create({
            data: group,
        })
    }

}

export async function updateExercicePosition(userId: UserId, updates: ExercicePositionUpdate[]) {
    const { user } = await validateRequest()
    if (!user || user.id !== userId) {
        return
    }

    if (updates.length === 0) {
        return
    }

    await db.$executeRaw`
        UPDATE "Exercice" AS e
        SET
            "groupOrder" = v."groupOrder",
            "exerciceGroupId" = v."groupId"
        FROM (
            VALUES ${Prisma.join(
                updates.map((item) => Prisma.sql`(${item.exerciceId}::text, ${item.groupOrder}::int, ${item.groupId}::text)`),
            )}
        ) AS v("id", "groupOrder", "groupId")
        WHERE e."id" = v."id"
          AND e."userId" = ${userId}
    `
}

export async function updateExerciceGroup(userId: UserId, updates: ExerciceGroupOrderUpdate[]) {
    const { user } = await validateRequest()
    if (!user || user.id !== userId) {
        return
    }

    if (updates.length === 0) {
        return
    }

    await db.$executeRaw`
        UPDATE "ExerciceGroup" AS g
        SET
            "name" = v."name",
            "order" = v."order"
        FROM (
            VALUES ${Prisma.join(
                updates.map((item) => Prisma.sql`(${item.groupId}::text, ${item.name}::text, ${item.order}::int)`),
            )}
        ) AS v("id", "name", "order")
        WHERE g."id" = v."id"
          AND g."userId" = ${userId}
    `
}

export async function createExercice(userId: UserId, exercice: CreateExerciceInput) {
    const { user } = await validateRequest()
    if (!user || user.id !== userId) {
        return null
    }

    const trimmedName = exercice.name.trim()
    if (!trimmedName) {
        return null
    }

    const targetGroup = await db.exerciceGroup.findFirst({
        where: {
            id: exercice.groupId,
            userId: userId,
        },
        select: {
            id: true,
        },
    })

    if (!targetGroup) {
        return null
    }

    const normalizedSets = Number.isFinite(exercice.sets) ? Math.max(1, Math.floor(exercice.sets)) : 1
    const normalizedReps = Number.isFinite(exercice.reps) ? Math.max(1, Math.floor(exercice.reps)) : 1
    const normalizedWeight = Number.isFinite(exercice.weight) ? Math.max(0, exercice.weight) : 0
    const normalizedGroupOrder = Number.isFinite(exercice.groupOrder) ? Math.max(1, Math.floor(exercice.groupOrder)) : 1

    const requestedLabels = Array.from(
        new Map(
            exercice.labels.map((label) => [label.labelId, label]),
        ).values(),
    )

    const validLabelIds = requestedLabels.length
        ? await db.labels.findMany({
            where: {
                id: {
                    in: requestedLabels.map((label) => label.labelId),
                },
                userId: userId,
            },
            select: {
                id: true,
            },
        })
        : []

    const validLabelIdSet = new Set(validLabelIds.map((label) => label.id))
    const validLabelAssignments = requestedLabels.filter((label) => validLabelIdSet.has(label.labelId))

    const createdExercice = await db.exercice.create({
        data: {
            name: trimmedName,
            description: exercice.description.trim(),
            userId: userId,
            exerciceGroupId: exercice.groupId,
            groupOrder: normalizedGroupOrder,
            perfs: {
                create: {
                    userId: userId,
                    sets: normalizedSets,
                    reps: normalizedReps,
                    weights: normalizedWeight,
                    unit: "kg",
                    notes: "",
                },
            },
            execiceLabels: validLabelAssignments.length
                ? {
                    create: validLabelAssignments.map((label) => ({
                        labelId: label.labelId,
                        value: label.value,
                    })),
                }
                : undefined,
        },
        include: {
            execiceLabels: {
                include: {
                    Labels: true,
                },
            },
            perfs: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    })

    return {
        ...createdExercice,
        exerciceGroupId: createdExercice.exerciceGroupId ?? exercice.groupId,
        exercicePerfs: createdExercice.perfs,
    }
}

export async function updateExercice(userId: UserId, exerciceId: string, updates: UpdateExerciceInput) {
    const { user } = await validateRequest()
    if (!user || user.id !== userId) {
        return null
    }

    const existingExercice = await db.exercice.findFirst({
        where: {
            id: exerciceId,
            userId: userId,
        },
        include: {
            perfs: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
            execiceLabels: true,
        },
    })

    if (!existingExercice) {
        return null
    }

    const trimmedName = updates.name.trim()
    if (!trimmedName) {
        return null
    }

    const normalizedSets = Number.isFinite(updates.sets) ? Math.max(1, Math.floor(updates.sets)) : 1
    const normalizedReps = Number.isFinite(updates.reps) ? Math.max(1, Math.floor(updates.reps)) : 1
    const normalizedWeight = Number.isFinite(updates.weight) ? Math.max(0, updates.weight) : 0

    const requestedLabels = Array.from(
        new Map(
            updates.labels.map((label) => [label.labelId, label]),
        ).values(),
    )

    const validLabelIds = requestedLabels.length
        ? await db.labels.findMany({
            where: {
                id: {
                    in: requestedLabels.map((label) => label.labelId),
                },
                userId: userId,
            },
            select: {
                id: true,
            },
        })
        : []

    const validLabelIdSet = new Set(validLabelIds.map((label) => label.id))
    const validLabelAssignments = requestedLabels.filter((label) => validLabelIdSet.has(label.labelId))

    await db.$transaction(async (tx) => {
        await tx.exercice.update({
            where: {
                id: exerciceId,
            },
            data: {
                name: trimmedName,
                description: updates.description.trim(),
            },
        })

        if (existingExercice.perfs[0]) {
            await tx.exercicePerfs.update({
                where: {
                    id: existingExercice.perfs[0].id,
                },
                data: {
                    sets: normalizedSets,
                    reps: normalizedReps,
                    weights: normalizedWeight,
                    unit: "kg",
                },
            })
        } else {
            await tx.exercicePerfs.create({
                data: {
                    userId: userId,
                    exerciceId: exerciceId,
                    sets: normalizedSets,
                    reps: normalizedReps,
                    weights: normalizedWeight,
                    unit: "kg",
                    notes: "",
                },
            })
        }

        const existingLabelsByLabelId = new Map(
            existingExercice.execiceLabels.map((labelLink) => [labelLink.labelId, labelLink]),
        )
        const requestedLabelIdSet = new Set(validLabelAssignments.map((label) => label.labelId))

        const labelLinkIdsToDelete = existingExercice.execiceLabels
            .filter((labelLink) => !requestedLabelIdSet.has(labelLink.labelId))
            .map((labelLink) => labelLink.id)

        if (labelLinkIdsToDelete.length > 0) {
            await tx.execiceLabels.deleteMany({
                where: {
                    id: {
                        in: labelLinkIdsToDelete,
                    },
                },
            })
        }

        for (const labelAssignment of validLabelAssignments) {
            const existingLabelLink = existingLabelsByLabelId.get(labelAssignment.labelId)

            if (!existingLabelLink) {
                await tx.execiceLabels.create({
                    data: {
                        exerciceId: exerciceId,
                        labelId: labelAssignment.labelId,
                        value: labelAssignment.value,
                    },
                })
                continue
            }

            if (existingLabelLink.value !== labelAssignment.value) {
                await tx.execiceLabels.update({
                    where: {
                        id: existingLabelLink.id,
                    },
                    data: {
                        value: labelAssignment.value,
                    },
                })
            }
        }
    })

    const updatedExercice = await db.exercice.findUnique({
        where: {
            id: exerciceId,
        },
        include: {
            execiceLabels: {
                include: {
                    Labels: true,
                },
            },
            perfs: {
                orderBy: {
                    createdAt: "desc",
                },
                take: 1,
            },
        },
    })

    if (!updatedExercice) {
        return null
    }

    const resolvedGroupId = updatedExercice.exerciceGroupId ?? existingExercice.exerciceGroupId
    if (!resolvedGroupId) {
        return null
    }

    return {
        ...updatedExercice,
        exerciceGroupId: resolvedGroupId,
        exercicePerfs: updatedExercice.perfs,
    }
}

export async function createExercicePerformance(perfData: ExercicePerfInput, exerciceId: string, userId: UserId) {

    await db.exercicePerfs.create({
        data: {
            weights: perfData.weight,
            reps: perfData.reps,
            sets: perfData.sets,
            notes: perfData.notes.trim(),
            exerciceId: exerciceId,
            userId: userId,
            unit: "kg",
        },
    })

    revalidatePath("/app/exercises")
}

export async function deleteExerciceGroup(userId: UserId, groupId: string) {
    const { user } = await validateRequest()
    if (!user || user.id !== userId) {
        return
    }

    const exerciceCount = await db.exercice.count({
        where: {
            exerciceGroupId: groupId,
            userId: userId,
        },
    })

    if (exerciceCount > 0) {
        return
    }

    await db.exerciceGroup.delete({
        where: {
            id: groupId,
        },
    })
}

export async function deleteExercice(userId: UserId, exerciceId: string) {
    const { user } = await validateRequest()
    if (!user || user.id !== userId) {
        return
    }

    await db.exercice.delete({
        where: {
            id: exerciceId,
        },
    })

    revalidatePath("/app/exercises")
}

//------------------- Split Actions -------------------//

export async function getLatestSplit(userId: UserId) {
    const data = await db.split.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 1,
    });
    const split = JSON.parse(JSON.stringify(data[0]));
    return split
}


export async function createSplit(userId: UserId, startDate: Date, length: number) {
    const { user } = await validateRequest()
    if (user) {
        await db.split.create({
            data: {
                userId: userId,
                startDate: startDate,
                length: length,
            },
        })  
    }

    revalidatePath("/app/progress")
}

//------------------- Progress Actions -------------------//

export async function getSplitWorkouts(userId: UserId, split: Split) {
    const { user } = await validateRequest()
    if (!user || user.id !== userId) {
        return []
    }

    if (!split) {
        return []
    }

    const startDate = new Date(split.startDate)
    startDate.setUTCHours(0, 0, 0, 0)

    const endDate = new Date(split.startDate)
    endDate.setUTCHours(0, 0, 0, 0)
    endDate.setUTCDate(endDate.getUTCDate() + split.length)

    const data = await db.exercicePerfs.findMany({
        where: {
            userId: userId,
            createdAt: {
                gte: startDate,
                lt: endDate
            },
        },


        orderBy: {
            createdAt: "desc",
        },
    });
    const workouts = JSON.parse(JSON.stringify(data));
    return workouts
}