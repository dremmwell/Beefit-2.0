/*
  Warnings:

  - Added the required column `instructions` to the `ArchivedRecipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `ArchivedRecipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArchivedRecipe" ADD COLUMN     "instructions" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
