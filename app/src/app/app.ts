import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header, ToastsComponent } from './shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, ToastsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('BrainRidge Banking');
}
