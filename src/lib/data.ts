import { sql } from '@vercel/postgres';
import {
    Ingredient,
    Recipe,
} from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';


// Reads ingredient list with a GET request to the api/ingredient endpoint

export async function getIngredients() {
    const data = {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    };
    const res = await fetch(
        `api/ingredients`,
        data
    );
    const response = await res.json();
    return(response.ingredients.rows);
}

// Saves new ingredient to DB

export async function saveIngredient(ingredient: Ingredient) {
 try {
    const postData = {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(ingredient),
    };

    console.log(postData);

    const res = await fetch(
        `api/ingredients`,
        postData
    );
    if(res.ok){
        console.log("POST successful")
    }else{
        console.log("Something is wrong on POST")
      }
 }
 catch (error){
    console.log(error)
 }

}

// Delete selected ingredients from DB

export async function deleteIngredient(id: string){
    console.log("delete", id);
}

// Update selected ingredient on DB

export async function updateIngredient(id: string){
    console.log("update", id);
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