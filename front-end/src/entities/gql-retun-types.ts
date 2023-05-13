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

export interface DeptData {
  getEventDebts: EventDebts[]
}

interface EventDebts {
  id: string;
  amount: number;
  repayed: boolean;
  debtor: {
    avatar: string;
    id: string;
    name: string;
  };
  creditor: {
    id: string;
    avatar: string;
    name: string;
  };
}
