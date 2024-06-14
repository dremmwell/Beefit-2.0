export type Ingredient = {
    id: string;
    name: string;
    unit: string;
    gramsPerUnit: number;
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
