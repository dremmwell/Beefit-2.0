import { useReducer } from 'react';
import { Ingredient } from '../definitions';

function ingredientReducer (ingredients, action) {
    switch (action.type) {
        case 'added': {
            console.log("reducer reached");
            return [...ingredients, action.ingrdient];
        }
    }
}