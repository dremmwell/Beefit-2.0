import {
    Ingredient,
    Recipe,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';


export async function fetchIngredient () {
    noStore();
}


