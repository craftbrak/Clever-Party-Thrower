export class User {
  id?: Nullable<number>;
  email?: Nullable<string>;
  name?: Nullable<string>;
  password?: Nullable<string>;
  drivingLicence?: Nullable<boolean>;
  manual?: Nullable<boolean>;
}
type Nullable<T> = T | null;