/*
  Warnings:

  - You are about to drop the column `type` on the `Meal` table. All the data in the column will be lost.
  - Added the required column `mealType` to the `Meal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "type",
ADD COLUMN     "mealType" TEXT NOT NULL;
