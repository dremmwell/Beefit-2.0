import {
    Ingredient,
} from './definitions';
import { v4 as uuidv4 } from 'uuid';
import { toast, useToast } from '@/components/ui/use-toast';

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

    const res = await fetch(
        `api/ingredients`,
        postData
    );
    if(res.ok){
        console.log("POST successful")
        toast({
            title: "Ingredient saved",
            description: `${ingredient.name} have been added to the database`,
        });
    }else{
        console.log("Something went wrong on POST")
      }
 }
 catch (error){
    console.log(error)
 }

}

// Delete selected ingredients from DB

export async function deleteIngredient(ingredient: Ingredient){
    try {
        const postData = {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(ingredient.id),
        };
    
        const res = await fetch(
            `api/ingredients`,
            postData
        );
        if(res.ok){
            console.log("DELETE successful")
            toast({
                title: "Ingredient deleted",
                description: `${ingredient.name} have been removed from the database`,
            });
        }else{
            console.log("Something went wrong on DELETE")
          }
     }
     catch (error){
        console.log(error)
     }
}

// Update selected ingredient on DB

export async function updateIngredient(ingredient: Ingredient){
    try {
        const postData = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(ingredient),
        };
    
        const res = await fetch(
            `api/ingredients`,
            postData
        );
        if(res.ok){
            console.log("UPDATE successful")
            toast({
                title: "Ingredient updated",
                description: `${ingredient.name} have been updated`,
            });
        }else{
            console.log("Something went wrong on UPDATE")
          }
     }
     catch (error){
        console.log(error)
     }
}

// Create a new ingredient object from the add ingredient form

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

// Edit the selected ingredient through the edit form

export function editIngredient(data: any, ingredient: Ingredient) {
    
    const newIngredient: Ingredient = {
        id: ingredient.id,
        name: data.name,
        per: data.measureType,
        gPerItem: data.measureWeight,
        calories: data.calories,
        proteins: data.proteins,
        carbs: data.carbs,
        fats: data.fats
    }
    if(data.measureType === "100g"){
        newIngredient.gPerItem = 100;
    }
    else{
        newIngredient.per = data.customMeasureName;
    }
    return newIngredient
}


export function convertTo100g(ingredient: Ingredient){
    
    const ratio = 100/ingredient.gPerItem;

    const convertedIngredient: Ingredient = {
        id: ingredient.id,
        name: ingredient.name,
        per: ingredient.per,
        gPerItem: ingredient.gPerItem,
        calories: ingredient.calories*ratio,
        proteins: ingredient.proteins*ratio,
        carbs: ingredient.carbs*ratio,
        fats: ingredient.fats*ratio
    }
    return convertedIngredient
}