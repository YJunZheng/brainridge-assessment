import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule],
  templateUrl: './toasts.html',
  styleUrls: ['./toasts.scss']
})
export class ToastsComponent {
  notification = inject(ToastService);
}
