import { sql } from '@vercel/postgres';
import {
    Ingredient,
    Recipe,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';


export async function fetchIngredient(): Promise<Ingredient[]> {
    noStore();
    try {
        console.log('Fetching ingredients data');
        const data = await sql<Ingredient>`SELECT * FROM ingredients`;
        console.log('Data fetch completed.');
        return data.rows;
    }
    catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch ingredient data.');
    }
}

/* export async function testIngredient() {
    try {
        await sql`INSERT INTO pets (name, owner) VALUES ('Mia', 'Bob')`;
    }
    catch (error){
        console.error('Database Error', error)
        throw new Error('Failed to save ingredient data.');
    }
}

testIngredient(); */

export async function saveIngredient(ingredient: Ingredient) {
    try {
        await sql`INSERT INTO ingredients (id, name, per, gPerItem, calories, proteins, carbs, fats) VALUES ('${ingredient.id}', '${ingredient.name}', '${ingredient.per}', '${ingredient.gPerItem}'; '${ingredient.calories}', '${ingredient.proteins}', '${ingredient.carbs}', '${ingredient.fats}')`;
    }
    catch (error){
        console.error('Database Error', error)
        throw new Error('Failed to save ingredient data.');
    }
}

export function createNewIngredient(data: any) {
    
    const uuid = uuidv4();
    const ingredient: Ingredient = {
        id: uuid,
        name: data.name,
        per: data.measureType,
        gPerItem: data.measureWeight,
        calories: data.calories,
        proteins: data.proteins,
        carbs: data.carbs,
        fats: data.fats
    }
    if(data.measureType === "100g"){
        ingredient.gPerItem = 100;
    }
    else{
        ingredient.per = data.customMeasureName;
    }
    return ingredient
}