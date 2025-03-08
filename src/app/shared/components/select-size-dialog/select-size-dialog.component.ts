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
    this._loadIcons();
  }

  private _loadIcons(): void {
    switch (this.data.category) {
      case MarkerIconsPlace.Place:
        this.icons = [
          'assets/icons/icons-placement/castle1.webp',
          'assets/icons/icons-placement/castle2.png',
          'assets/icons/icons-placement/castle3.png',
        ];
        break;
      
      case MarkerIconsPlace.Geografy:
        this.icons = [
          'assets/icons/icons-placement/mountain1.svg',
          'assets/icons/icons-placement/mountain2.svg',
          'assets/icons/icons-placement/mountain3.svg',
        ];
        break;
    
      default:
        this.icons = [];
        break;
    }
  }

  onConfirm(): void {
    const selectedMarker: MarkerIconInterface = {
      icon: this.selectedIcon,
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
