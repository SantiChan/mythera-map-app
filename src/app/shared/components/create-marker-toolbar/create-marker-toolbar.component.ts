import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MarkerIconInterface } from '../../interfaces/icons/marker-icon.interface';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-marker-toolbar',
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './create-marker-toolbar.component.html',
  styleUrl: './create-marker-toolbar.component.scss'
})
export class CreateMarkerToolbarComponent {
  @Input() selectedMarker: MarkerIconInterface | null = null;
  @Output() add = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onAdd(): void {
    this.add.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
