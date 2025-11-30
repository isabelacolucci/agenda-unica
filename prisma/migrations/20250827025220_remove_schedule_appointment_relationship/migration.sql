/*
  Warnings:

  - You are about to drop the column `schedule_id` on the `appointments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."appointments" DROP CONSTRAINT "appointments_schedule_id_fkey";

-- AlterTable
ALTER TABLE "public"."appointments" DROP COLUMN "schedule_id";
