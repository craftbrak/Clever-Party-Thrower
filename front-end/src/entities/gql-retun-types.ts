export type EventData = {
  event: {
    id: string,
    name: string,
    description: string,
    address: {
      postalCode: string,
      unitNumber: string,
      line1: string,
      city: string,
      country: {
        name: string,
        id: string,
      },
      id: string,
    },
  },
};
