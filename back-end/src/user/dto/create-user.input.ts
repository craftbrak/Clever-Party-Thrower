export class CreateUserInput {
  email: string;
  name: string;
  password: string;
  drivingLicence?: Nullable<boolean>;
  manual?: Nullable<boolean>;
}
type Nullable<T> = T | null;