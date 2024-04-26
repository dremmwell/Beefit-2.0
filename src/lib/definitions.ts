export type Ingredient = {
    id: string;
    name: string;
    per: string;
    gPerItem: number;
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