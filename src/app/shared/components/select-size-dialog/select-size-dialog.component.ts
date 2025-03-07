import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface DialogData {
  category: string;
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
  ],
})
export class SelectSizeDialogComponent {
  // Tamaño inicial (pequeño, mediano, grande)'
  selectedSize: string = 'mediano';
  selectedIcon: string = '';

  icons: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<SelectSizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    // Dependiendo de la categoría, cargamos los iconos
    if (this.data.category === 'Lugares') {
      this.icons = [
        'assets/icons/icons-placement/castle1.webp',
        'assets/icons/icons-placement/castle2.png',
        'assets/icons/icons-placement/castle3.png',
      ];
    } else if (this.data.category === 'Geografía') {
      this.icons = [
        'assets/icons/icons-placement/mountain1.svg',
        'assets/icons/icons-placement/mountain2.svg',
        'assets/icons/icons-placement/mountain3.svg',
      ];
    }
  }

  onConfirm(): void {
    this.dialogRef.close({
      size: this.selectedSize,
      icon: this.selectedIcon,
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
