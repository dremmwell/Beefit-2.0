import { sql } from '@vercel/postgres';
import {
    Ingredient,
    Recipe,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';


export async function fetchIngredient () {
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
