/*
  Warnings:

  - Added the required column `mealType` to the `ArchivedMeal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArchivedMeal" ADD COLUMN     "mealType" TEXT NOT NULL;
