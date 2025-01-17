import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapBoxComponent } from './main-map-screen/map.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MapBoxComponent],
  template: `
    <app-mapbox></app-mapbox>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
}
