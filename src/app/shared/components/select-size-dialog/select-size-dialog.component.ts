import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkerIconsPlace, MarkerIconsPlaceTranslate, MarkerIconsSize } from '../../enums/icons/marker-icons.enum';
import { MarkerService } from '../../services/marker.service';
import { MarkerIconInterface } from '../../interfaces/icons/marker-icon.interface';

interface DialogData {
  category: MarkerIconsPlace;
}

@Component({
  selector: 'app-select-size-dialog',
  standalone: true,
  templateUrl: './select-size-dialog.component.html',
  styleUrls: ['./select-size-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatDialogModule,
  ]
})
export class SelectSizeDialogComponent {
  selectedSize: MarkerIconsSize = MarkerIconsSize.Medium;
  selectedIcon: string = '';
  MarkerIconsSize = MarkerIconsSize;

  icons: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<SelectSizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private markerService: MarkerService 
  ) {}

  ngOnInit(): void {
  }

  onConfirm(): void {
    const selectedMarker: MarkerIconInterface = {
      size: this.selectedSize,
    };

    this.markerService.setSelectedMarker(selectedMarker); 
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getCategoryName(value: MarkerIconsPlace): string {
    return MarkerIconsPlaceTranslate[value] || "Desconocido";
  }
}
