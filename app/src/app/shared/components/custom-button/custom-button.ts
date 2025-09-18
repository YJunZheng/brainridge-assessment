import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

export type ButtonColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.scss'
})
export class CustomButton {
  @Input() text: string = '';
  @Input() color: ButtonColor = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled: boolean = false;
  @Input() icon: string = '';
  @Input() size: 'sm' | 'lg' | '' = '';
  
  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const baseClasses = ['btn'];
    
    if (this.color) {
      baseClasses.push(`btn-${this.color}`);
    }
    
    if (this.size) {
      baseClasses.push(`btn-${this.size}`);
    }
    
    return baseClasses.join(' ');
  }

  get iconClasses(): string {
    const classes = ['bi'];
    if (this.icon) {
      classes.push(this.icon);
    }
    if (this.text) {
      classes.push('me-2');
    }
    return classes.join(' ');
  }

  handleClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
