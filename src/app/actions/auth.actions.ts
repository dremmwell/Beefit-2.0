"use server"

import { z } from "zod"
import { LogInSchema, SignUpSchema } from "../types/auth.schema"
import { generateId } from "lucia";
import db from "@/db/db";
import { lucia, validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { seedDB } from "./db.actions/seed.actions";

const bcrypt = require('bcrypt');
const saltRounds = 10;

export const signUp = async (values: z.infer<typeof SignUpSchema>) => {
  
    const hashPassword = async (password : string) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };
    const hashedPassword = await hashPassword(values.password)
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
                password_hash: hashedPassword,
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
  
    const validPassword = await bcrypt.compare(
      value.password,
      existingUser.password_hash
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