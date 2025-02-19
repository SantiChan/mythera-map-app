import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbox',
  standalone: true,
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class ToolboxComponent {
  @Output() elementSelected = new EventEmitter<string>();

  selectCastle(): void {
    this.elementSelected.emit('castle');
  }
}
