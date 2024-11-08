/*
  Warnings:

  - You are about to drop the `MealFromIngredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealFromRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MealFromIngredients" DROP CONSTRAINT "MealFromIngredients_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "MealFromIngredients" DROP CONSTRAINT "MealFromIngredients_userId_fkey";

-- DropForeignKey
ALTER TABLE "MealFromRecipe" DROP CONSTRAINT "MealFromRecipe_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "MealFromRecipe" DROP CONSTRAINT "MealFromRecipe_userId_fkey";

-- DropTable
DROP TABLE "MealFromIngredients";

-- DropTable
DROP TABLE "MealFromRecipe";

-- CreateTable
CREATE TABLE "MealIngredient" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'grams',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealIngredient" ADD CONSTRAINT "MealIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealIngredient" ADD CONSTRAINT "MealIngredient_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
