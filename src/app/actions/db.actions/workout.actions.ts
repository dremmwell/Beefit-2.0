"use server"

import db from "@/db/db";
import { Focus, Labels } from "@prisma/client";
import { UserId } from "lucia";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache'

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
    if(user) {
        await db.labels.update({
            where: {
                id: label.id,
            },
            data: {
                focusId: focusId,
            },
        })
    }
    revalidatePath('/app/ingredients')
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