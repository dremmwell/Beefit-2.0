/*
  Warnings:

  - The primary key for the `RecipeIngredient` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "RecipeIngredient" DROP CONSTRAINT "RecipeIngredient_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RecipeIngredient_id_seq";
