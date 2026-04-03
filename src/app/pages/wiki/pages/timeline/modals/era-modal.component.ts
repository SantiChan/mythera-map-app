import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-era-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <div class="modal-container">
      <div class="modal-header">
        <h2 mat-dialog-title>{{ isEdit ? 'Editar Era' : 'Nueva Era' }}</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content>
        <form [formGroup]="form" class="era-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nombre de la Era</mat-label>
            <input matInput formControlName="name" placeholder="Ej: Edad de los Mitos">
            <mat-error *ngIf="form.get('name')?.hasError('required')">El nombre es obligatorio</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Orden (1 = Primera Era)</mat-label>
            <input matInput type="number" formControlName="order" placeholder="Ej: 1">
            <mat-error *ngIf="form.get('order')?.hasError('required')">El orden es obligatorio</mat-error>
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
    .era-form { display: flex; flex-direction: column; gap: 16px; padding-top: 24px; }
    .full-width { width: 100%; }
    mat-dialog-actions { padding: 16px 24px; }
  `]
})
export class EraModalComponent implements OnInit {
    form: FormGroup;
    isEdit = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EraModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            order: [1, Validators.required]
        });
    }

    ngOnInit() {
        if (this.data && this.data.era) {
            this.isEdit = true;
            this.form.patchValue(this.data.era);
        }
    }

    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
