import { CreateCarpoolDto } from "../../carpool/dto/create-carpool.dto";
import { Directions } from "../../carpool/entities/carpool.entity";
import { randNumber } from "@ngneat/falso";

export const CarpoolMock = (
  stratingAddressId: string,
  destinationId: string,
  driverId: string,
  carId: string,
  eventId: string,
): CreateCarpoolDto => {
  return {
    direction: Directions.go,
    totalLength: randNumber(),
    finalDestinationId: destinationId,
    startDestinationId: stratingAddressId,
    driverId: driverId,
    carId: carId,
    eventId: eventId,
    departure: new Date(Date.now()),
    arrival: new Date(Date.now()),
  };
};
