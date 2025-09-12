import { Component, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../core/services/data.service';
import { CustomButton } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-fund-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButton],
  templateUrl: './fund-transfer.html',
  styleUrl: './fund-transfer.scss',
})
export class FundTransfer {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);

  accounts = computed(() => this.dataService.accounts());

  transferForm: FormGroup = this.fb.group(
    {
      fromAccountId: ['', Validators.required],
      toAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.maxLength(100)],
    },
    { validators: [this.sameAccountValidator, this.insufficientFundsValidator.bind(this)] }
  );

  private sameAccountValidator(form: FormGroup) {
    const fromAccountId = form.get('fromAccountId')?.value;
    const toAccountId = form.get('toAccountId')?.value;

    if (fromAccountId && toAccountId && fromAccountId === toAccountId) {
      return { sameAccount: true };
    }
    return null;
  }

  private insufficientFundsValidator(form: FormGroup) {
    const fromAccountId = form.get('fromAccountId')?.value;
    const amount = form.get('amount')?.value;

    if (fromAccountId && amount) {
      const availableBalance = this.getAccountBalance(fromAccountId);
      if (amount > availableBalance) {
        return { insufficientFunds: true };
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.transferForm.valid) {
      const formValue = this.transferForm.value;
      const success = this.dataService.transferFunds(
        formValue.fromAccountId,
        formValue.toAccountId,
        formValue.amount
      );

      if (success) {
        this.toastService.success('Transfer successful');
        this.transferForm.reset();
      } else {
        this.toastService.error('Transfer failed. Please try again.');
      }
    }
  }

  clearForm(): void {
    this.transferForm.reset();
  }

  getErrorMessage(fieldName: string): string {
    const field = fieldName.toLowerCase().replace(' ', '');
    let control;

    if (field === 'fromaccount') control = this.transferForm.get('fromAccountId');
    else if (field === 'toaccount') control = this.transferForm.get('toAccountId');
    else control = this.transferForm.get(field);

    if (control?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control?.hasError('min')) {
      return `${fieldName} must be at least $0.01`;
    }
    if (control?.hasError('maxlength')) {
      return `${fieldName} cannot exceed 100 characters`;
    }
    
    if (field === 'amount' && this.transferForm.hasError('insufficientFunds')) {
      return 'Transfer amount exceeds available balance';
    }
    
    return '';
  }

  getFormError(): string {
    if (this.transferForm.hasError('sameAccount')) {
      return 'Source and destination accounts must be different';
    }
    if (this.transferForm.hasError('insufficientFunds')) {
      return 'Transfer amount exceeds available balance';
    }
    return '';
  }

  getAccountBalance(accountId: string): number {
    const account = this.dataService.getAccountById(accountId);
    return account?.balance || 0;
  }

  getAccountName(accountId: string | null): string {
    if (!accountId) return '';
    const account = this.dataService.getAccountById(accountId);
    return account?.accountName || '';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  }
}
