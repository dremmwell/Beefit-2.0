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


export async function POST(request: Request) {
  try {

    const ingredient = await request.json();
    console.log(ingredient);

     // Insert the new ingredient into the database
     await sql`INSERT INTO ingredients (id, name, per, gPerItem, calories, proteins, carbs, fats) VALUES (${ingredient.id}, ${ingredient.name}, ${ingredient.per}, ${ingredient.gPerItem}, ${ingredient.calories}, ${ingredient.proteins}, ${ingredient.carbs}, ${ingredient.fats});`;
 
     // Return a success response
     return NextResponse.json({ message: 'Ingredient added successfully' }, { status: 201 });
  } catch (error) {
     console.error('Database Error', error);
     // Return an error response
     return NextResponse.json({ error: 'Failed to add ingredient' }, { status: 500 });
  }
 }