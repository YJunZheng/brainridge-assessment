import { Injectable, signal, WritableSignal } from '@angular/core';
import { Account, AccountType, Transaction } from '../../shared';
import { v4 as uuidv4 } from 'uuid';

function generateUUID(): string {
  if (typeof globalThis !== 'undefined' && 
      globalThis.crypto && 
      typeof globalThis.crypto.randomUUID === 'function') {
    try {
      return globalThis.crypto.randomUUID();
    } catch {
    }
  }
  return uuidv4();
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // We should use observables and behavior subjects on a real app
  // But I will keep it simple for this demo app

  public accounts: WritableSignal<Account[]> = signal([]);
  public transactions: WritableSignal<Transaction[]> = signal([]);

  constructor() {
    // this.initializeMockData();
    // this.initializeMockTransactions();
  }

  // Mock data for testing
  private initializeMockData(): void {
    const mockAccounts: Account[] = [
      {
        id: '1',
        accountName: 'John Doe Chequing',
        accountType: 'Chequing',
        balance: 1500.0,
        createdDate: new Date('2024-01-15')
      },
      {
        id: '2',
        accountName: 'Jane Smith Savings',
        accountType: 'Savings',
        balance: 5000.0,
        createdDate: new Date('2024-02-01')
      },
      {
        id: '3',
        accountName: 'Business Account',
        accountType: 'Savings',
        balance: 10000.0,
        createdDate: new Date('2024-01-10')
      }
    ];

    this.accounts.set(mockAccounts);
  }

  private initializeMockTransactions(): void {
    const mockTransactions: Transaction[] = [];

    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - 3);

    const totalDays = 90;
    const increment = Math.floor(totalDays / 20);

    for (let i = 1; i <= 20; i++) {
      const transactionDate = new Date(baseDate);
      transactionDate.setDate(transactionDate.getDate() + i * increment);

      if (i % 2 === 0) {
        mockTransactions.push({
          id: generateUUID(),
          fromAccountId: '1',
          toAccountId: '2',
          amount: Math.floor(Math.random() * 500) + 50,
          timestamp: transactionDate
        });
      } else {
        mockTransactions.push({
          id: generateUUID(),
          fromAccountId: '2',
          toAccountId: '1',
          amount: Math.floor(Math.random() * 300) + 25,
          timestamp: transactionDate
        });
      }
    }

    this.transactions.set(mockTransactions);
  }

  getAllAccounts(): Account[] {
    return this.accounts();
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts().find(acc => acc.id === id);
  }

  createAccount(accountName: string, accountType: AccountType, initialBalance: number): Account {
    const newAccount: Account = {
      id: generateUUID(),
      accountName,
      accountType,
      balance: initialBalance,
      createdDate: new Date()
    };
    this.accounts.update(accounts => [...accounts, newAccount]);
    return newAccount;
  }

  createTransaction(fromAccountId: string, toAccountId: string, amount: number): Transaction {
    const transaction: Transaction = {
      id: generateUUID(),
      fromAccountId,
      toAccountId,
      amount,
      timestamp: new Date()
    };
    this.transactions.update(transactions => [...transactions, transaction]);
    return transaction;
  }

  getAllTransactions(): Transaction[] {
    return this.transactions();
  }

  getTransactionsByAccountId(accountId: string): Transaction[] {
    return this.transactions().filter(transaction => transaction.fromAccountId === accountId || transaction.toAccountId === accountId);
  }

  transferFunds(fromAccountId: string, toAccountId: string, amount: number): Transaction | null {
    const fromAccount = this.getAccountById(fromAccountId);
    const toAccount = this.getAccountById(toAccountId);

    if (!fromAccount || !toAccount || fromAccount.balance < amount) {
      return null;
    }

    // Immutable update of accounts
    this.accounts.update(accounts => 
      accounts.map(account => {
        if (account.id === fromAccountId) {
          return { ...account, balance: account.balance - amount };
        }
        if (account.id === toAccountId) {
          return { ...account, balance: account.balance + amount };
        }
        return account;
      })
    );

    return this.createTransaction(fromAccountId, toAccountId, amount);
  }
}