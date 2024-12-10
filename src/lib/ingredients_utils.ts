import {
    Ingredient,
} from '@prisma/client'

export function convertTo100g(ingredient: Ingredient){
    
    const ratio = 100/ingredient.gramsPerUnit;

    const convertedIngredient: Ingredient = {
        id: ingredient.id,
        name: ingredient.name,
        unit: ingredient.unit,
        gramsPerUnit: ingredient.gramsPerUnit,
        calories: parseFloat((ingredient.calories * ratio).toFixed(1)),
        proteins: parseFloat((ingredient.proteins * ratio).toFixed(1)),
        carbs: parseFloat((ingredient.carbs * ratio).toFixed(1)),
        fats: parseFloat((ingredient.fats * ratio).toFixed(1)),
        userId: ingredient.userId,
        bookmarked: ingredient.bookmarked,
        createdAt: ingredient.createdAt,
        updatedAt: ingredient.updatedAt,
        customMeal: ingredient.customMeal
    }
    return convertedIngredient
}

/* // Reads ingredient list with a GET request to the api/ingredient endpoint

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
            title: "Ingredient saved - Refresh to see changes",
            description: `${ingredient.name} have been added to the database.`,
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
                title: "Ingredient deleted  - Refresh to see changes",
                description: `${ingredient.name} have been removed from the database.`,
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
                title: "Ingredient updated  - Refresh to see changes",
                description: `${ingredient.name} have been updated`,
            });
        }else{
            console.log("Something went wrong on UPDATE")
          }
     }
     catch (error){
        console.log(error)
     }
} */


