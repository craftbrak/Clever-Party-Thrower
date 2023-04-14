export interface CreateAddressDto {
    unitNumber: string;
    line1: string;
    city: string;
    postalCode: string;
    countryId: string;
    ownerId?: string;
}
