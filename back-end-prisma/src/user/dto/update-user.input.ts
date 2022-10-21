import { CreateUserInput } from './create-user.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserInput extends PartialType(CreateUserInput) {
  id: number;
  email?: Nullable<string>;
  name?: Nullable<string>;
  password?: Nullable<string>;
  drivingLicence?: Nullable<boolean>;
  manual?: Nullable<boolean>;
}

type Nullable<T> = T | null;