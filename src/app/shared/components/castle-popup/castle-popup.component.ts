import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CastleOverlayComponent } from '../castle-overlay/castle-overlay.component';

@Component({
  selector: 'app-castle-popup',
  standalone: true,
  templateUrl: './castle-popup.component.html',
  styleUrls: ['./castle-popup.component.scss'],
  imports: [
    MatCardModule, // Importar el módulo de MatCard
    MatButtonModule, // Para los botones dentro del MatCard
  ],
})
export class CastlePopupComponent {
  constructor(
    public dialogRef: MatDialogRef<CastlePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; description: string },
    private dialog: MatDialog
  ) {}

  onViewMore(): void {
    this.dialog.open(CastleOverlayComponent, {
      width: '80%',
      height: 'auto',
      data: this.data,
    });
    this.dialogRef.close();
  }
}
