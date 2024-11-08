-- AlterTable
ALTER TABLE "MealIngredient" ALTER COLUMN "unit" DROP DEFAULT;

-- CreateTable
CREATE TABLE "MealRecipe" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "mealId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealRecipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealRecipe" ADD CONSTRAINT "MealRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealRecipe" ADD CONSTRAINT "MealRecipe_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
