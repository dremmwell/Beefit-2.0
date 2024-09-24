import { z } from "zod"

// Ingredients form schemas //

export const AddIngredientFormSchema = z.object({
    name: z.string().min(2, {
      message: "Ingredient name must be at least 2 characters.",
    }).max(40, {
      message: "Ingredient name must be at most 40 characters.",
    }),
    measureType: z.string(),
    customMeasureName: z.string().max(15).optional(),
    measureWeight: z.union([
        z.coerce
            .number()
            .positive({
                message: "must be positive",
            }),
        z.literal("")
    ]).optional(),
    calories: z.union([
        z.coerce
            .number()
            .positive({
                message: "must be positive",
            }),
        z.literal("")
    ]),
    proteins: z.union([
        z.coerce
            .number()
            .positive({
                message: "must be positive",
            }),
        z.literal("")
    ]),
    carbs: z.union([
        z.coerce
            .number()
            .positive({
                message: "must be positive",
            }),
        z.literal("")
    ]),
    fats: z.union([
        z.coerce
            .number()
            .positive({
                message: "must be positive",
            }),
        z.literal("")
    ]),
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
  measureWeight: z.coerce.number().optional(),
  calories: z.coerce.number().positive(),
  proteins: z.coerce.number().positive(),
  carbs: z.coerce.number().positive(),
  fats: z.coerce.number().positive(),
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


// Recipe form schemas //

export const AddRecipeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Recipe name must be at least 2 characters.",
  }).max(40,{
    message: "Recipe name must be at most 40 characters."
  }),
  description: z.string().optional(),
  ingredients: z.array
  (z.object({
    id: z.string(),
    quantity: z.union([
      z.coerce
          .number()
          .positive({
              message: "must be positive",
          }),
      z.literal("")
    ]),
    unit : z.string()
  })).nonempty({ message: "Select an ingredient" })
})
