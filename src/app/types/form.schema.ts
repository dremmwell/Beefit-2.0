import { z } from "zod"

export const AddIngredientFormSchema = z.object({
    name: z.string().min(2, {
      message: "Ingredient name must be at least 2 characters.",
    }),
    measureType: z.string(),
    customMeasureName: z.string().optional(),
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