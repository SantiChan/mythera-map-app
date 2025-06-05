import {Component, EventEmitter, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { SelectSizeDialogComponent } from '../select-size-dialog/select-size-dialog.component';
import { MarkerIconInterface } from '../../interfaces/icons/marker-icon.interface';
import { MarkerIconsPlace } from '../../enums/icons/marker-icons.enum';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatToolbarModule],
})
export class ToolboxComponent {
  @Output() placementSelected = new EventEmitter<MarkerIconInterface>();
  markerIconsPlace = MarkerIconsPlace; // expose enum to template

  constructor(private dialog: MatDialog) {}

  openSizeDialog(category: MarkerIconsPlace): void {
    const dialogRef = this.dialog.open(SelectSizeDialogComponent, {
      data: { category },
      width: '1500px',
      height: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.placementSelected.emit(result);
      }
    });
  }
}
