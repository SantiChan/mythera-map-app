import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-event-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2 mat-dialog-title>{{ isEdit ? 'Editar Evento' : 'Nuevo Evento' }}</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <form [formGroup]="form" class="event-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Título del Evento</mat-label>
            <input matInput formControlName="title" placeholder="Ej: La Comunión">
            <mat-error *ngIf="form.get('title')?.hasError('required')">El título es obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Era</mat-label>
            <mat-select formControlName="eraId">
              <mat-option *ngFor="let era of eras" [value]="era._id">
                {{ era.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('eraId')?.hasError('required')">Debes seleccionar una Era</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Año</mat-label>
            <input matInput type="number" formControlName="year" placeholder="Ej: 500">
            <mat-error *ngIf="form.get('year')?.hasError('required')">El año es obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descripción</mat-label>
            <textarea matInput formControlName="description" rows="5" placeholder="Descripción detallada del evento..."></textarea>
            <mat-error *ngIf="form.get('description')?.hasError('required')">La descripción es obligatoria</mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">Guardar</button>
      </mat-dialog-actions>
    </div>
  `,
    styles: [`
    .modal-container { background: var(--surface); color: var(--font-white); border: 1px solid rgba(200, 170, 110, 0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid rgba(200, 170, 110, 0.2); }
    h2 { margin: 0; color: var(--link-gold); }
    .event-form { display: flex; flex-direction: column; gap: 16px; padding-top: 24px; }
    .full-width { width: 100%; }
    mat-dialog-actions { padding: 16px 24px; }
  `]
})
export class EventModalComponent implements OnInit {
    form: FormGroup;
    isEdit = false;
    eras: any[] = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EventModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            year: [0, Validators.required],
            eraId: ['', Validators.required]
        });
    }

    ngOnInit() {
        if (this.data && this.data.eras) {
            this.eras = this.data.eras;
        }
        if (this.data && this.data.event) {
            this.isEdit = true;
            const eventData = { ...this.data.event };
            if (typeof eventData.eraId === 'object' && eventData.eraId !== null) {
                eventData.eraId = eventData.eraId._id;
            }
            this.form.patchValue(eventData);
        }
    }

    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
