export type Ingredient = {
    id: string;
    name: string;
    per: '100g' | 'item' | string;
    gPerItem: '100g' | number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
};

export type Recipe = {
    id: string;
    name: string;
    ingrdient: Ingredient;
}