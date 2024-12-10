"use server"

import { z } from "zod"
import { LogInSchema, SignUpSchema } from "../types/auth.schema"
import * as argon2 from "argon2";
import { generateId } from "lucia";
import db from "@/db/db";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { seedDB } from "./db.actions";

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  
    const hashedPassword = await argon2.hash(values.password)
    const userId = generateId(15)
  
    try {
      const existingUser = await db.user.findUnique({
        where: {
          username: values.username,
        },
      });
      if (existingUser) {
        return {
          error: "Username already taken",
        };
      }
        await db.user.create({
            data: {
                id: userId,
                username: values.username,
                password_hash: hashedPassword
            },
          })
      
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      await seedDB(userId);

      return {
        success: true,
        data: {
          userId,
        },
      }
    } catch (error: any) {
      return {
        error: error.message,
      }
    }
}

export const logIn = async (value: z.infer<typeof LogInSchema>) => {

  try{
    const existingUser = await db.user.findUnique({
      where: {
        username: value.username,
      },
    });
  
    if (!existingUser) {
      return {
        error: "User not found",
      };
    }
  
    if(!existingUser.password_hash){
      return {
        error: "User not found",
      };
    }
  
    const validPassword = await argon2.verify(
      existingUser.password_hash,
      value.password
    )
  
    if(!validPassword) {
      return {
        error: "Incorrect username or password"
      }
    }
  
    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  
    return {
      success: "Logged in sucessfully",
    }
  }
  catch(error){
    console.log(error)
  }
}

export const signOut = async () => {

  try {
    const {session} = await validateRequest()

    if(!session){
      return {
        error: "Unauthorized"
      }
    }
  
    await lucia.invalidateSession(session.id)
  
    const sessionCookie = lucia.createBlankSessionCookie()
  
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )

  }
  catch (error: any){
    return {
      error: error.message,
    }
  }

}