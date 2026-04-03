import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { NarrativeArcsService } from '../../../../shared/services/wiki/narrative-arcs.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConfirmModalComponent } from './modals/confirm-modal.component';

@Component({
  selector: 'app-narrative-arc-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    AngularEditorModule
  ],
  templateUrl: './narrative-arc-detail.component.html',
  styleUrls: ['./narrative-arc-detail.component.scss']
})
export class NarrativeArcDetailComponent implements OnInit {
  arcId: string = '';
  arc: any = null;
  editingSessionId: string | null = null;
  
  sessionForm!: FormGroup;
  sessionTypes = ['Campaña', 'Quest', 'Oneshot', 'Bishot'];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    minHeight: '100px',
    placeholder: 'Escribe aquí...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['insertImage', 'insertVideo']],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
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

  // --- Session Form methods --- //
  initSessionForm(session?: any) {
    this.sessionForm = this.fb.group({
      title: [session?.title || '', Validators.required],
      type: [session?.type || 'Campaña', Validators.required],
      startLevel: [session?.startLevel || '', Validators.required],
      players: this.fb.array([]),
      contents: this.fb.array([])
    });

    if (session?.players?.length) {
      session.players.forEach((player: any) => this.addPlayer(player));
    }

    if (session?.contents?.length) {
      session.contents.forEach((content: any) => this.addContent(content));
    }
  }

  get players(): FormArray {
    return this.sessionForm.get('players') as FormArray;
  }

  get contents(): FormArray {
    return this.sessionForm.get('contents') as FormArray;
  }

  createPlayerGroup(player?: any): FormGroup {
    return this.fb.group({
      name: [player?.name || '', Validators.required],
      character: [player?.character || '', Validators.required],
      level: [player?.level || 1, [Validators.required, Validators.min(1)]]
    });
  }

  createContentGroup(content?: any): FormGroup {
    return this.fb.group({
      title: [content?.title || '', Validators.required],
      initialSummary: [content?.initialSummary || '', Validators.required],
      finalSummary: [content?.finalSummary || '', Validators.required]
    });
  }

  addPlayer(player?: any) {
    this.players.push(this.createPlayerGroup(player));
  }

  removePlayer(index: number) {
    this.players.removeAt(index);
  }

  addContent(content?: any) {
    this.contents.push(this.createContentGroup(content));
  }

  removeContent(index: number) {
    this.contents.removeAt(index);
  }

  addSession() {
    this.editingSessionId = 'new';
    this.initSessionForm();
  }

  editSession(session: any) {
    this.editingSessionId = session._id;
    this.initSessionForm(session);
  }

  cancelEditSession() {
    this.editingSessionId = null;
  }

  saveSession() {
    if (this.sessionForm.invalid) return;

    const sessionData = this.sessionForm.value;

    if (this.editingSessionId === 'new') {
      this.narrativeArcsService.addSession(this.arcId, sessionData).subscribe({
        next: (response) => {
          this.loadArcDetails();
          this.snackbar.success('Partida añadida');
          this.editingSessionId = null;
        },
        error: (err) => {
          console.error(err);
          this.snackbar.error('Error al añadir partida');
        }
      });
    } else if (this.editingSessionId) {
      this.narrativeArcsService.updateSession(this.arcId, this.editingSessionId, sessionData).subscribe({
        next: (response) => {
          this.loadArcDetails();
          this.snackbar.success('Partida actualizada');
          this.editingSessionId = null;
        },
        error: (err) => {
          console.error(err);
          this.snackbar.error('Error al actualizar partida');
        }
      });
    }
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
            if (this.editingSessionId === sessionId) this.editingSessionId = null;
          },
          error: (err) => {
            console.error(err);
            this.snackbar.error('Error al eliminar partida');
          }
        });
      }
    });
  }
}
