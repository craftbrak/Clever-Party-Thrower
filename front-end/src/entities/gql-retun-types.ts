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

export interface EventDebts {
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

export interface Buyer {
  id: string;
  avatar: string;
  name: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
}

export interface SpendingData {
  id: string;
  name?: string
  value: number;
  buyer: Buyer;
  beneficiary: Buyer;
  shoppingListItem: ShoppingListItem | null;
}


