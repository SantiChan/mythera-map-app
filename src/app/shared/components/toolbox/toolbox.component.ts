import {Component, EventEmitter, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SelectSizeDialogComponent } from '../select-size-dialog/select-size-dialog.component';
import { MarkerIconInterface } from '../../interfaces/icons/marker-icon.interface';
import { MarkerIconsPlace } from '../../enums/icons/marker-icons.enum';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MatToolbarModule, MatDividerModule],
})
export class ToolboxComponent {
  markerIconsPlace = MarkerIconsPlace;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private _markerService: MarkerService,
  ) {}

  openSizeDialog(category: MarkerIconsPlace): void {
    if(MarkerIconsPlace.City === category) {
      this.dialog.open(SelectSizeDialogComponent, {
        data: { category }
      });

      return;
    }

    var marker: MarkerIconInterface = {
      type: category
    };

    this._markerService.setSelectedMarker(marker);
  }

  goToWiki(): void {
    this.router.navigate(['/wiki']);
  }
}
