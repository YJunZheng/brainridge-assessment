export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  timestamp: Date;
}

export interface TransactionHistory {
  accountId: string;
  transactions: Transaction[];
}
