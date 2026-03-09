import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { NarrativeArcsService } from '../../../../shared/services/wiki/narrative-arcs.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { NarrativeArcModalComponent } from './modals/narrative-arc-modal.component';
import { SessionModalComponent } from './modals/session-modal.component';
import { ConfirmModalComponent } from './modals/confirm-modal.component';

@Component({
  selector: 'app-narrative-arc-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule
  ],
  templateUrl: './narrative-arc-detail.component.html',
  styleUrls: ['./narrative-arc-detail.component.scss']
})
export class NarrativeArcDetailComponent implements OnInit {
  arcId: string = '';
  arc: any = null;
  editingSessionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private narrativeArcsService: NarrativeArcsService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    this.arcId = this.route.snapshot.paramMap.get('id') || '';
    this.loadArcDetails();
  }

  loadArcDetails() {
    this.narrativeArcsService.getById(this.arcId).subscribe({
      next: (arc) => {
        console.log("arco", arc)
        this.arc = arc;
      },
      error: (err) => {
        console.error('Error loading arc:', err);
        this.snackbar.error('Error al cargar arco narrativo');
        this.router.navigate(['/wiki/arcos-narrativos']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/wiki/arcos-narrativos']);
  }

  editArc() {
    const ref = this.dialog.open(NarrativeArcModalComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'arc-modal-container',
      data: {
        isNew: false,
        arc: JSON.parse(JSON.stringify(this.arc))
      }
    });

    ref.afterClosed().subscribe((result: any) => {
      if (!result) return;

      this.narrativeArcsService.update(this.arcId, result.arc, result.file).subscribe({
        next: (response) => {
          this.arc = response.arc;
          this.snackbar.success('Arco narrativo actualizado');
        },
        error: (err) => {
          console.error(err);
          this.snackbar.error('Error al actualizar arco narrativo');
        }
      });
    });
  }

  addSession() {
    const ref = this.dialog.open(SessionModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'session-modal-container',
      data: {}
    });

    ref.afterClosed().subscribe((sessionData: any) => {
      if (!sessionData) return;

      this.narrativeArcsService.addSession(this.arcId, sessionData).subscribe({
        next: (response) => {
          this.loadArcDetails();
          this.snackbar.success('Partida añadida');
        },
        error: (err) => {
          console.error(err);
          this.snackbar.error('Error al añadir partida');
        }
      });
    });
  }

  editSession(session: any) {
    const ref = this.dialog.open(SessionModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'session-modal-container',
      data: { session: JSON.parse(JSON.stringify(session)) }
    });

    ref.afterClosed().subscribe((sessionData: any) => {
      if (!sessionData) return;

      this.narrativeArcsService.updateSession(this.arcId, session._id, sessionData).subscribe({
        next: (response) => {
          this.loadArcDetails();
          this.snackbar.success('Partida actualizada');
        },
        error: (err) => {
          console.error(err);
          this.snackbar.error('Error al actualizar partida');
        }
      });
    });
  }

  deleteSession(sessionId: string) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Estás seguro de que quieres eliminar esta partida? Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.narrativeArcsService.deleteSession(this.arcId, sessionId).subscribe({
          next: () => {
            this.loadArcDetails();
            this.snackbar.success('Partida eliminada');
          },
          error: (err) => {
            console.error(err);
            this.snackbar.error('Error al eliminar partida');
          }
        });
      }
    });
  }

  toggleEditMode(sessionId: string) {
    this.editingSessionId = this.editingSessionId === sessionId ? null : sessionId;
  }

  isEditing(sessionId: string): boolean {
    return this.editingSessionId === sessionId;
  }
}
