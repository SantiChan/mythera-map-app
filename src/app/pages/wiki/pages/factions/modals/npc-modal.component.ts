import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PlaceService } from '../../../../../shared/services/places.service';
import { NpcsService } from '../../../../../core/services/wiki/npcs.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-npc-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  template: `
<div mat-dialog-content class="npc-modal__wrapper">
  <!-- View Mode -->
  <div *ngIf="isReadonly" class="npc-modal__content">
    <div class="image-preview">
      <img *ngIf="imagePreview" [src]="imagePreview" alt="npc" class="preview-img" />
      
      <div *ngIf="!imagePreview" class="no-image-placeholder">
        <mat-icon>person</mat-icon>
        <p>Sin imagen</p>
      </div>

      <button mat-icon-button class="icon-btn close-btn" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    
    <div class="npc-modal__text-wrapper">
      <h1>{{ data.npc?.name }}</h1>
      <h3 class="npc-title">{{ data.npc?.title }}</h3>
      <p class="npc-personality">{{ data.npc?.personality }}</p>
      
      <div class="npc-description">
        <h4>Descripción</h4>
        <div [innerHTML]="data.npc?.descriptionHtml"></div>
      </div>
    </div>
  </div>
  
  <!-- Edit Mode -->
  <div *ngIf="!isReadonly" class="npc-modal__content">
    <div class="image-preview">
      <img *ngIf="imagePreview" [src]="imagePreview" alt="npc" class="preview-img" />
      
      <div *ngIf="!imagePreview" class="no-image-placeholder">
        <mat-icon>person</mat-icon>
        <p>Sin imagen</p>
      </div>
      
      <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none;" />
      
      <button mat-icon-button class="icon-btn close-btn" (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
      
      <button mat-icon-button class="icon-btn edit-image-btn" (click)="fileInput.click()">
        <mat-icon>{{ imagePreview ? 'edit' : 'add_photo_alternate' }}</mat-icon>
      </button>
    </div>
    
    <div class="npc-modal__text-wrapper">
      <h2>Nuevo personaje</h2>
      
      <form [formGroup]="form" class="character-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Título</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Lugar Vinculado</mat-label>
          <mat-select formControlName="placeId">
            <div style="padding: 8px 16px; position: sticky; top: 0; background: var(--surface); z-index: 2; border-bottom: 1px solid rgba(255,255,255,0.1);">
              <input placeholder="Buscar lugar..." [formControl]="searchPlaceCtrl" (keydown)="$event.stopPropagation()" 
                     style="width: 100%; padding: 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.2); color: white; box-sizing: border-box;" />
            </div>
            <mat-option *ngFor="let p of filteredPlaces" [value]="p._id">{{ p.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Personalidad</mat-label>
          <input matInput formControlName="personality" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción (Admite HTML)</mat-label>
          <textarea matInput formControlName="descriptionHtml" rows="5"></textarea>
        </mat-form-field>
      </form>

      <div class="npc-modal__actions">
        <button mat-stroked-button color="warn" type="button" (click)="close()">Cancelar</button>
        <button mat-stroked-button color="primary" type="button" [disabled]="form.invalid" (click)="save()">Crear PNJ</button>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
.npc-modal__wrapper {
  padding: 0; margin: 0; overflow: hidden; max-height: 90vh; display: flex; flex-direction: column;
}

.npc-modal__content {
  position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden;

  .image-preview {
    position: relative; text-align: center; flex-shrink: 0; padding: 32px 0 16px 0;
    background: linear-gradient(to bottom, #1a1a1a 0%, var(--surface) 100%);

    .preview-img {
      width: 250px; height: 250px; border-radius: 50%; object-fit: cover; margin: 0 auto;
      border: 4px solid var(--link-gold); box-shadow: 0 4px 20px rgba(0,0,0,0.5); background-color: var(--surface); display: block;
    }

    .no-image-placeholder {
      width: 250px; height: 250px; border-radius: 50%; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%); color: rgba(255, 255, 255, 0.3); border: 4px solid var(--link-gold); box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      mat-icon { font-size: 80px; width: 80px; height: 80px; margin-bottom: 16px; }
      p { margin: 0; font-size: 18px; font-weight: 500; }
    }

    .icon-btn { position: absolute; background-color: rgba(0, 0, 0, 0.7); color: white; border-radius: 50%; &:hover { background-color: rgba(0, 0, 0, 0.9); } }
    .close-btn { top: 8px; right: 8px; }
    .edit-image-btn { top: 8px; right: 58px; background-color: var(--link-gold); color: var(--light-black); &:hover { background-color: #d1ba86; } }
  }

  .npc-modal__text-wrapper {
    padding: 24px; flex: 1; margin: 0 auto; width: 100%; max-width: 800px;
    h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: var(--link-gold); }
    h2 { margin: 0 0 16px 0; font-size: 24px; font-weight: 700; }
    h3.npc-title { margin: 0 0 8px 0; font-size: 18px; font-weight: 500; color: #666; }
    h4 { margin: 16px 0 8px 0; font-size: 16px; font-weight: 600; }
    .npc-personality { margin: 0 0 16px 0; font-style: italic; color: #888; }
    .npc-description { margin-bottom: 16px; }
    .character-form { display: flex; flex-direction: column; gap: 0px; padding-top: 16px; }
    .full-width { width: 100%; margin-bottom: 4px; }
    .npc-modal__actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; padding-top: 16px; }
  }
}

::ng-deep .mat-mdc-dialog-container {
  padding: 0; overflow: hidden;
  .mat-mdc-dialog-surface { background: var(--surface); color: var(--font-white); }
  .mat-mdc-dialog-content { padding: 0; margin: 0; max-height: none; overflow: hidden; }
}
  `]
})
export class NpcModalComponent implements OnInit {
  form: FormGroup;
  searchPlaceCtrl = new FormControl('');
  imageFile: File | null = null;
  imagePreview: string | null = null;
  places: any[] = [];
  filteredPlaces: any[] = [];
  isReadonly: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NpcModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private placeService: PlaceService,
    private npcsService: NpcsService,
    private snackbar: SnackbarService
  ) {
    this.isReadonly = this.data?.isReadonly || false;
    this.form = this.fb.group({
      name: [{value: '', disabled: this.isReadonly}, Validators.required],
      title: [{value: '', disabled: this.isReadonly}],
      placeId: [{value: '', disabled: this.isReadonly}],
      personality: [{value: '', disabled: this.isReadonly}],
      descriptionHtml: [{value: '', disabled: this.isReadonly}]
    });
  }

  ngOnInit() {
    this.placeService.getPlaces().subscribe((data: any) => {
      this.places = data;
      this.filteredPlaces = data;
    });

    this.searchPlaceCtrl.valueChanges.subscribe(searchTerm => {
      if (!searchTerm) {
        this.filteredPlaces = this.places;
      } else {
        const term = searchTerm.toLowerCase();
        this.filteredPlaces = this.places.filter(p => p.name.toLowerCase().includes(term));
      }
    });
    
    if (this.data?.npc && this.isReadonly) {
      this.form.patchValue({
        name: this.data.npc.name,
        title: this.data.npc.title,
        placeId: this.data.npc.placeId,
        personality: this.data.npc.personality,
        descriptionHtml: this.data.npc.descriptionHtml
      });
      this.imagePreview = this.data.npc.imageUrl || null;
    }
  }

  close() {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
          this.imageFile = file;
          const reader = new FileReader();
          reader.onload = (e: any) => {
              this.imagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
      }
  }

  save() {
    if (this.form.invalid) return;

    const formData = new FormData();
    const data = this.form.value;

    ['name', 'title', 'personality', 'descriptionHtml', 'placeId'].forEach(field => {
        if (data[field]) formData.append(field, data[field]);
    });

    if (this.imageFile) {
        formData.append('file', this.imageFile);
    }

    this.npcsService.createNpc(formData).subscribe({
        next: (created) => {
            this.dialogRef.close(created);
        },
        error: () => this.snackbar.error('Error al crear personaje')
    });
  }
}
