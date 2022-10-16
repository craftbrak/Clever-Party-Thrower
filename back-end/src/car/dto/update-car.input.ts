import { CreateCarInput } from './create-car.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCarInput extends PartialType(CreateCarInput) {
  id: number;
}
