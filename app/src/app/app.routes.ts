import { Routes } from '@angular/router';
import { AccountList } from './features/accounts/components/account-list/account-list';
import { AccountCreation } from './features/accounts/components/account-creation/account-creation';
import { FundTransfer } from './features/transactions/components/fund-transfer/fund-transfer';
import { TransactionHistory } from './features/transactions/components/transaction-history/transaction-history';

export const routes: Routes = [
  { path: '', redirectTo: '/accounts', pathMatch: 'full' },
  { path: 'accounts', component: AccountList },
  { path: 'create-account', component: AccountCreation },
  { path: 'transfer-funds', component: FundTransfer },
  { path: 'transaction-history/:accountId', component: TransactionHistory },
  { path: '**', redirectTo: '/accounts' }
];
