/*
  Warnings:

  - Changed the type of `grams` on the `RecipeIngredient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "grams",
ADD COLUMN     "grams" DOUBLE PRECISION NOT NULL;
