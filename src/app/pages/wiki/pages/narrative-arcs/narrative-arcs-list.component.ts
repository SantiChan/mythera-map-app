import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NarrativeArcsService } from '../../../../shared/services/wiki/narrative-arcs.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { NarrativeArcModalComponent } from './modals/narrative-arc-modal.component';

@Component({
  selector: 'app-narrative-arcs-list',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './narrative-arcs-list.component.html',
  styleUrls: ['./narrative-arcs-list.component.scss']
})
export class NarrativeArcsListComponent implements OnInit {
  narrativeArcs: any[] = [];
  flippedArcIds = new Set<string>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private narrativeArcsService: NarrativeArcsService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.loadNarrativeArcs();
  }

  loadNarrativeArcs() {
    this.narrativeArcsService.getAll().subscribe({
      next: (arcs) => {
        this.narrativeArcs = arcs;
      },
      error: (err) => {
        console.error('Error loading narrative arcs:', err);
        this.snackbar.error('Error al cargar arcos narrativos');
      }
    });
  }

  addNarrativeArc() {
    const newArc = {
      title: '',
      descriptionHtml: '<p></p>',
    };

    const ref = this.dialog.open(NarrativeArcModalComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'arc-modal-container',
      data: {
        isNew: true,
        arc: newArc
      }
    });

    ref.afterClosed().subscribe((result: any) => {
      if (!result) return;

      this.narrativeArcsService.create(result.arc, result.file).subscribe({
        next: (response) => {
          this.narrativeArcs.push(response.arc);
          this.snackbar.success('Arco narrativo creado');
        },
        error: (err) => {
          console.error(err);
          this.snackbar.error('Error al crear arco narrativo');
        }
      });
    });
  }

  toggleFlip(arcId: string) {
    if (this.flippedArcIds.has(arcId)) {
      this.flippedArcIds.delete(arcId);
    } else {
      this.flippedArcIds.add(arcId);
    }
  }

  viewArcDetails(arcId: string) {
    this.router.navigate(['/wiki/arcos-narrativos', arcId]);
  }
}
