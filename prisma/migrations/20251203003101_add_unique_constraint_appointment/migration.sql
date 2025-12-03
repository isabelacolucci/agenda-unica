/*
  Warnings:

  - A unique constraint covering the columns `[provider_id,date,time]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appointments_provider_id_date_time_key" ON "public"."appointments"("provider_id", "date", "time");
