import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Transaction } from '../../../../shared';
import { DataService } from '../../../../core/services/data.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.scss'
})
export class TransactionHistory {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);

  Math = Math;

  accountId = this.route.snapshot.paramMap.get('accountId') || '';

  currentPage = signal(0);
  itemsPerPage = signal(5);
  showFilters = signal(false);
  filterTrigger = signal(0);

  filterForm = this.fb.group({
    dateFrom: [''],
    dateTo: [''],
    minAmount: [null as number | null],
    maxAmount: [null as number | null]
  });

  account = computed(() => this.dataService.getAccountById(this.accountId));
  
  allTransactions = computed(() => this.dataService.getTransactionsByAccountId(this.accountId));

  filteredTransactions = computed(() => {
    const transactions = this.allTransactions();
    this.filterTrigger();
    const filters = this.filterForm.value;

    const filtered = transactions.filter(transaction => {
      if (filters.dateFrom) {
        const fromDateStr = filters.dateFrom; // YYYY-MM-DD format
        const transactionDate = new Date(transaction.timestamp);
        const transactionDateStr = transactionDate.getFullYear() + '-' + 
          String(transactionDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(transactionDate.getDate()).padStart(2, '0');
        
        if (transactionDateStr < fromDateStr) {
          return false;
        }
      }
      
      if (filters.dateTo) {
        const toDateStr = filters.dateTo; // YYYY-MM-DD format
        const transactionDate = new Date(transaction.timestamp);
        const transactionDateStr = transactionDate.getFullYear() + '-' + 
          String(transactionDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(transactionDate.getDate()).padStart(2, '0');
        
        if (transactionDateStr > toDateStr) {
          return false;
        }
      }

      if (filters.minAmount !== null && filters.minAmount !== undefined && filters.minAmount > 0) {
        if (transaction.amount < filters.minAmount) {
          return false;
        }
      }

      if (filters.maxAmount !== null && filters.maxAmount !== undefined && filters.maxAmount > 0) {
        if (transaction.amount > filters.maxAmount) {
          return false;
        }
      }

      return true;
    });

    return filtered;
  });

  // Paginated transactions
  paginatedTransactions = computed(() => {
    const filtered = this.filteredTransactions();
    const startIndex = this.currentPage() * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return filtered.slice(startIndex, endIndex);
  });

  // Pagination info
  totalPages = computed(() => 
    Math.ceil(this.filteredTransactions().length / this.itemsPerPage())
  );

  totalItems = computed(() => this.filteredTransactions().length);

  // Page range for pagination controls
  pageRange = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const range = [];
    
    const start = Math.max(0, Math.min(current - 2, total - 5));
    const end = Math.min(total, start + 5);
    
    for (let i = start; i < end; i++) {
      range.push(i);
    }
    return range;
  });

  getAccountName(accountId: string): string {
    const account = this.dataService.getAccountById(accountId);
    return account?.accountName || 'Unknown Account';
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  }

  trackByTransactionId(index: number, transaction: Transaction): string {
    return transaction.id;
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  // Items per page selector
  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage.set(parseInt(select.value));
    this.currentPage.set(0);
  }

  // Filter methods
  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  applyFilters(): void {
    this.currentPage.set(0);
    this.filterTrigger.update(value => value + 1);
  }

  clearFilters(): void {
    this.filterForm.reset({
      dateFrom: '',
      dateTo: '',
      minAmount: null,
      maxAmount: null
    });
    this.currentPage.set(0);
    this.filterTrigger.update(value => value + 1);
  }
}
