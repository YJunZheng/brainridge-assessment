import { Injectable, signal, WritableSignal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: WritableSignal<Toast[]> = signal([]);

  show(message: string, type: Toast['type'] = 'info', ttl = 5000) {
    const id = uuidv4();
    const toast: Toast = { id, message, type };
    this.toasts.update(t => [...t, toast]);
    if (ttl > 0) setTimeout(() => this.dismiss(id), ttl);
  }

  success(message: string, ttl = 5000) { this.show(message, 'success', ttl); }
  error(message: string, ttl = 5000) { this.show(message, 'error', ttl); }
  warning(message: string, ttl = 5000) { this.show(message, 'warning', ttl); }
  info(message: string, ttl = 5000) { this.show(message, 'info', ttl); }

  dismiss(id: string) {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
