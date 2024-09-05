export type Ingredient = {
    id: string;
    name: string;
    unit: string;
    gramsPerUnit: number;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    userId: string;
    bookmarked: boolean;
    createdAt: number;
    updatedAt: number;
};

export type Recipe = {
    id: string;
    name: string;
    ingredient: Ingredient;
}
