import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const ingredients =
      await sql`SELECT * FROM ingredients`;
    return NextResponse.json({ ingredients: ingredients }, { status: 200 });
  } catch (error) {
    console.error('Database Error',error)
    return NextResponse.json({ error }, { status: 500 });
  }
}