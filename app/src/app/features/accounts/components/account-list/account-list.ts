import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { CustomButton } from '../../../../shared';
import { DataService } from '../../../../core/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, CustomButton],
  templateUrl: './account-list.html',
  styleUrl: './account-list.scss'
})
export class AccountList {
  private dataService = inject(DataService);
  private router = inject(Router);

  accounts = computed(() => this.dataService.accounts());

  navigateToCreateAccount(): void {
    this.router.navigate(['/create-account']);
  }

  viewTransactionHistory(accountId: string): void {
    this.router.navigate(['/transaction-history', accountId]);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  }
}
