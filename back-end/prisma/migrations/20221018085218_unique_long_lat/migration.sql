/*
  Warnings:

  - A unique constraint covering the columns `[long,lat]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_long_lat_key" ON "Address"("long", "lat");
