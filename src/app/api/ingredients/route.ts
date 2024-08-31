import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
/* export async function GET(request: Request) {
  try {
    const ingredients = await sql`SELECT * FROM ingredients`;

    return NextResponse.json({ ingredients: ingredients }, { status: 200 });

  } catch (error) {
    console.error('Database Error',error)
    return NextResponse.json({ error }, { status: 500 });
  }
} */


/* export async function POST(request: Request) {
  try {
    const ingredient = await request.json();

     await sql`INSERT INTO ingredients (id, name, per, gperitem, calories, proteins, carbs, fats) VALUES (${ingredient.id}, ${ingredient.name}, ${ingredient.per}, ${ingredient.gperitem}, ${ingredient.calories}, ${ingredient.proteins}, ${ingredient.carbs}, ${ingredient.fats});`;
 
     return NextResponse.json({ message: 'Ingredient added successfully' }, { status: 201 });

  } catch (error) {
     console.error('Database Error', error);
     return NextResponse.json({ error: 'Failed to add ingredient' }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try{
    const ingredient_id = await request.json();

    await sql `DELETE FROM ingredients WHERE id = ${ingredient_id}`;

    return NextResponse.json({ message: 'Ingredient deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Database Error', error);
    return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 });
  }
}


export async function PUT(request: Request){
  try{
    const ingredient = await request.json();

    await sql`UPDATE ingredients SET name = ${ingredient.name}, per = ${ingredient.per}, gperitem = ${ingredient.gperitem}, calories = ${ingredient.calories}, proteins = ${ingredient.proteins}, carbs = ${ingredient.carbs}, fats = ${ingredient.fats} WHERE id = ${ingredient.id}`;

    return NextResponse.json({ message: 'Ingredient updated successfully'}, {status: 200});
  } catch (error)
  {
    console.error('Database Error', error);
    return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
  }
} */