export interface Account {
  id: string;
  accountName: string;
  accountType: 'Chequing' | 'Savings';
  balance: number;
  createdDate: Date;
}

export type AccountType = 'Chequing' | 'Savings';