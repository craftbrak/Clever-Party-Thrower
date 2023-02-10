export interface UserInterface {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  drivingLicence: boolean;
  manual: boolean;
  addressId: string;
  hashedRefreshToken?: string;
  hashedEmailValidationToken?: string;
  is2faEnabled?: boolean;
  isVerified?: boolean;
  twoFaKey?: string;
}
