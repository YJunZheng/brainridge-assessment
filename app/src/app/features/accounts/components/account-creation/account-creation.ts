import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../../../core/services/data.service';
import { Router } from '@angular/router';
import { CustomButton } from '../../../../shared';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-account-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButton],
  templateUrl: './account-creation.html',
  styleUrls: ['./account-creation.scss']
})
export class AccountCreation {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  accountForm: FormGroup = this.fb.group({
    accountName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    accountType: ['Chequing', Validators.required],
    balance: [null, [Validators.required, this.nonNegativeValidator]]
  });

  accountTypes = ['Chequing', 'Savings'];

  // Custom validator to handle -0 and ensure truly non-negative values
  private nonNegativeValidator(control: any) {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { invalidNumber: true };
    }
    
    if (Object.is(numValue, -0) || numValue < 0) {
      return { min: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const { accountName, accountType, balance } = this.accountForm.value;
      const newAccount = this.dataService.createAccount(accountName, accountType, balance);
      if (newAccount) {
        this.router.navigate(['/accounts']);
        this.toastService.success('Account created successfully!');
      } else {
        this.toastService.error('Account creation failed. Please try again.');
      }
    }
  }

  navigateToAccounts(): void {
    this.router.navigate(['/accounts']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.accountForm.get(controlName);

    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum length is ' + control.getError('minlength').requiredLength + ' characters.';
    }
    if (control?.hasError('maxlength')) {
      return 'Maximum length is ' + control.getError('maxlength').requiredLength + ' characters.';
    }
    if (control?.hasError('min')) {
      return 'The initial balance cannot be negative.';
    }
    return '';
  }
}
