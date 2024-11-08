-- CreateTable
CREATE TABLE "MealFromRecipe" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "quanity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealFromRecipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealFromIngredients" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "ingredientId" TEXT,

    CONSTRAINT "MealFromIngredients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealFromRecipe" ADD CONSTRAINT "MealFromRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealFromRecipe" ADD CONSTRAINT "MealFromRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealFromIngredients" ADD CONSTRAINT "MealFromIngredients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealFromIngredients" ADD CONSTRAINT "MealFromIngredients_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
