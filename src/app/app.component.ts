import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderService } from './shared/services/loader.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    NgIf, 
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private loaderService = inject(LoaderService); 
  isLoading$ = this.loaderService.isLoading$;
}
