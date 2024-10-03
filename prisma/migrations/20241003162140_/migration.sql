/*
  Warnings:

  - You are about to drop the column `grams` on the `RecipeIngredient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "grams",
ADD COLUMN     "quantity" DOUBLE PRECISION NOT NULL DEFAULT 100;
