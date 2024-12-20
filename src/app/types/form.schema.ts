import { z } from "zod"

//------------------------------------------ Ingredients form schemas ------------------------------------------//

export const AddIngredientSchema = z.object({
  name: z.string().min(2, {
    message: "Ingredient name must be at least 2 characters.",
  }).max(40,{
    message: "Ingredient name must be at most 40 characters."
  }),
  measureType: z.string(),
  customMeasureName: z.string().max(15, {
    message: "Cannot exceed 40 characters."
  }).optional(),
  measureWeight: z.coerce.number().positive({message: "must be positive",}).optional(),
  calories: z.coerce.number().positive({message: "must be positive",}),
  proteins: z.coerce.number().positive({message: "must be positive",}),
  carbs: z.coerce.number().positive({message: "must be positive",}),
  fats: z.coerce.number().positive({message: "must be positive",}),
}).refine((data) => {
  if(data.measureType === "custom") {
    return !!data.customMeasureName;
  }
  return true;
},
{
  message: "Custom measure requires a name",
  path: ["customMeasureName"],
}
)
.refine((data) => {
  if(data.measureType === "custom") {
    return !!data.measureWeight;
  }
  return true;
},
{
  message: "Custom measure requires a weight",
  path: ["measureWeight"],
});


export const EditIngredientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Ingredient name must be at least 2 characters.",
  }).max(40,{
    message: "Ingredient name must be at most 40 characters."
  }),
  measureType: z.string(),
  customMeasureName: z.string().max(15, {
    message: "Cannot exceed 40 characters."
  }).optional(),
  measureWeight: z.coerce.number().positive({message: "must be positive",}).optional(),
  calories: z.coerce.number().positive({message: "must be positive",}),
  proteins: z.coerce.number().positive({message: "must be positive",}),
  carbs: z.coerce.number().positive({message: "must be positive",}),
  fats: z.coerce.number().positive({message: "must be positive",}),
})
.refine((data) => {
  if(data.measureType === "custom") {
    return !!data.customMeasureName;
  }
  return true;
},
{
  message: "Custom measure requires a name",
  path: ["customMeasureName"],
}
)
.refine((data) => {
  if(data.measureType === "custom") {
    return !!data.measureWeight;
  }
  return true;
},
{
  message: "Custom measure requires a weight",
  path: ["measureWeight"],
}
);

//--------------------------------------------- Recipe form schemas ----------------------------------------------//

export const AddRecipeFormSchema = z.object({
  recipeName: z.string().min(2, {
    message: "Recipe name must be at least 2 characters.",
  }).max(100,{
    message: "Recipe name must be at most 40 characters."
  }),
  description: z.string().optional(),
  ingredients: z.array
  (z.object({
    quantity: z.union([
      z.coerce
          .number()
          .positive({
              message: "must be greater than 0",
          }),
      z.literal("")
  ]),
    unit : z.string(),
    gramsPerUnit : z.number(),
    name : z.string(),
    ingredientid: z.string(),
    rowid: z.string(),
    ingredientUnit: z.string()
  })).nonempty("Select at least one ingredient")
})

//--------------------------------------------- Meal form schema -------------------------------------------------//

export const MealIngredientSchema = z.object({
  meal: z.string(),
  ingredients : z.array(
    z.object({
      quantity: 
      z.union([
        z.coerce
            .number()
            .positive({
                message: "must be greater than 0",
            }),
        z.literal("")
    ]),
      unit: z.string(),
      gramsPerUnit : z.number(),
      name : z.string(),
      ingredientid: z.string(),
      rowid: z.string(),
      ingredientUnit: z.string()
    })
  ).nonempty("Select at least one ingredient")
})

export const MealRecipeSchema = z.object({
  meal: z.string(),
  recipe : z.array(
    z.object({
      quantity: 
      z.union([
        z.coerce
            .number()
            .positive({
                message: "must be greater than 0",
            }),
        z.literal("")
    ]),
      unit: z.string(),
      name : z.string(),
      recipeid: z.string(),
      rowid: z.string(),
    })
  ).nonempty("Select at least one recipe")
})

export const CustomMealSchema = z.object({
  mealType: z.string().min(2, {
    message: "Meal name must be at least 2 characters.",
  }).max(40,{
    message: "Meal name must be at most 40 characters."
  }),
  description: z.string(),
  calories:  z.coerce.number().positive({message: "must be positive"}),
  proteins: z.coerce.number().positive({message: "must be positive"}),
  carbs: z.coerce.number().positive({message: "must be positive"}),
  fats:  z.coerce.number().positive({message: "must be positive"})
})