"use server"

import db from "@/db/db";
import { ExerciceGroup, Focus, Labels, Prisma } from "@prisma/client";
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

export async function createLabel(userId: UserId, label :Labels) {
    const { user } = await validateRequest()
    if(user) {
        await db.labels.create({
            data: {
                id: label.id,
                name: label.name,
                color: label.color,
                userId: userId,
                focusId: label.focusId,
                createdAt: label.createdAt,
            },
        })
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
    }
    return
}

export async function editLabel(userId: UserId, labelId: string, name: string, color: string) {
    const { user } = await validateRequest()
    if(user) {
        await db.labels.update({
            where: {
                id: labelId,
            },
            data: {
                name: name,
                color: color,
            },
        })
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
        }
    }
}

//------------------- Exercice Actions -------------------//

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

export async function createExercicePerformance(perfData: ExercicePerfInput, exerciceId: string) {

    await db.exercicePerfs.create({
        data: {
            weights: perfData.weight,
            reps: perfData.reps,
            sets: perfData.sets,
            notes: perfData.notes.trim(),
            exerciceId: exerciceId,
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
    if(user){
        if(user.id === userId){ 
            await db.exercice.delete({
                where: {
                    id: exerciceId,
                }
            })
        }
    }
}