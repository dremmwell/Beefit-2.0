"use server"

import { User } from "lucia";
import db from "@/db/db";
import { validateRequest } from "@/lib/auth";
import { revalidatePath } from 'next/cache';

export async function getUserInfo(user : User) {
    const data = await db.user.findUnique({
        where: {
            id : user.id
        }
    })
    const userInfo = JSON.parse(JSON.stringify(data));
    return userInfo
}

export async function changeProfilePicture(userId: string, avatar : number) {
    const { user } = await validateRequest()
    if(user && userId == user.id){
        await db.user.update({
            where : {
                id : userId
            },
            data : {
                avatar: avatar
            }
        })
        revalidatePath('/app')
    }
}