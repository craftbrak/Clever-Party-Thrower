import {EntityBase} from "./EntityBase.entity";
import {EventToUser} from "./event-to-user.entity";
import {Address} from "./address.entity";
import {Car} from "./car.entity";

export interface UserEntity extends EntityBase {
  name: string;

  email: string;
  password: string;

  avatar?: string;

  drivingLicence: boolean;

  manual: boolean;

  eventToUsers: EventToUser[];

  address: Address;

  addressId: Address["id"];

  cars: Car[];

  hashedRefreshToken?: string;

  hashedEmailValidationToken?: string;

  is2faEnabled?: boolean;

  isVerified?: boolean;
  twoFaKey?: string;
}
