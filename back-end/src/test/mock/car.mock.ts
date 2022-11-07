import { CreateCarDto } from "../../car/dto/create-car.dto";
import { BootSizes, Fuels } from "../../car/entities/car.entity";

export const CarMock: CreateCarDto = {
  bootSize: BootSizes.Big,
  brand: "citroen",
  consumption: 5.5,
  fuel: Fuels.Petrol,
  manualTransmission: true,
  maxPassengers: 5,
  model: "DS9",
  range: 300,
};
