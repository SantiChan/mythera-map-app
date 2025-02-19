import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-castle-overlay',
  standalone: true,
  templateUrl: './castle-overlay.component.html',
  styleUrls: ['./castle-overlay.component.scss'],
  imports: [MatCardModule, MatButtonModule],
})
export class CastleOverlayComponent {
  constructor(
    public dialogRef: MatDialogRef<CastleOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; description: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
