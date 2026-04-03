import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RacesService } from '../../shared/services/wiki/races.service';

@Component({
  selector: 'app-wiki',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {
  races: any[] = [];

  constructor(private racesService: RacesService) { }

  ngOnInit() {
    // Subscribe to the behavior subject
    this.racesService.races$.subscribe({
      next: (data) => this.races = data,
      error: (err) => console.error('Error loading races for sidebar', err)
    });

    // Trigger the initial HTTP fetch to populate the subject
    this.racesService.getRaces().subscribe();
  }
}
