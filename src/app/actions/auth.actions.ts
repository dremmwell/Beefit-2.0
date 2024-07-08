"use server"
import { z } from "zod"
import { SignUpSchema } from "../types"
import * as argon2 from "argon2";
import { generateIdFromEntropySize } from "lucia";
import db from "@/db/db";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
    console.log(values)
  
    const hashedPassword = await argon2.hash(values.password)
    const userId = generateIdFromEntropySize(16)
  
    try {
        await db.user.create({
            data: {
                id: userId,
                username: values.username,
                password_hash: hashedPassword
            },
          })
        
      const session = await lucia.createSession(userId, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
  
      return {
        success: true,
        data: {
          userId,
        },
      }
    } catch (error: any) {
      return {
        error: error?.message,
      }
    }
  }