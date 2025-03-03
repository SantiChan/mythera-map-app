import {Component, EventEmitter, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { SelectSizeDialogComponent } from '../select-size-dialog/select-size-dialog.component';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatToolbarModule],
})
export class ToolboxComponent {
  @Output() placementSelected = new EventEmitter<{ size: string; icon: string }>();

  constructor(private dialog: MatDialog) {}

  // Método para seleccionar tamaño de imagen( llamamos a SelectSizeDialogComponent)
  openSizeDialog(category: string): void {
    const dialogRef = this.dialog.open(SelectSizeDialogComponent, {
      data: { category },
      width: '1500px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // result contiene { size, icon }
        // Emitir el evento para que el MapBoxComponent lo reciba
        this.placementSelected.emit(result);
      }
    });
  }
}
