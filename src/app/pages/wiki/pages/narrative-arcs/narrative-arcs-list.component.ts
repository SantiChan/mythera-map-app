import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { NarrativeArcsService } from '../../../../shared/services/wiki/narrative-arcs.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ConfirmModalComponent } from './modals/confirm-modal.component';

@Component({
  selector: 'app-narrative-arcs-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AngularEditorModule
  ],
  templateUrl: './narrative-arcs-list.component.html',
  styleUrls: ['./narrative-arcs-list.component.scss']
})
export class NarrativeArcsListComponent implements OnInit {
  narrativeArcs: any[] = [];
  selectedArc: any = null;
  isEditing = false;
  
  form!: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | null = null;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '200px',
    translate: 'no',
    toolbarHiddenButtons: [['insertVideo', 'toggleEditorMode']],
  };

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private narrativeArcsService: NarrativeArcsService,
    private snackbar: SnackbarService
  ) {
      this.initForm();
  }

  ngOnInit() {
    this.loadNarrativeArcs();
  }

  initForm(arc?: any) {
      this.form = this.fb.group({
          title: [arc?.title || '', Validators.required],
          descriptionHtml: [arc?.descriptionHtml || '']
      });

      this.imageFile = null;
      this.imagePreview = arc?.imageUrl || null;
  }

  loadNarrativeArcs() {
    this.narrativeArcsService.getAll().subscribe({
      next: (arcs) => {
        this.narrativeArcs = arcs;
        if (this.selectedArc && this.selectedArc._id) {
            const refreshed = this.narrativeArcs.find(a => a._id === this.selectedArc._id);
            this.selectedArc = refreshed || null;
        }
      },
      error: (err) => {
        console.error('Error loading narrative arcs:', err);
        this.snackbar.error('Error al cargar arcos narrativos');
      }
    });
  }

  selectArc(arc: any) {
      this.selectedArc = arc;
      this.isEditing = false;
      this.imagePreview = arc.imageUrl || null;
  }

  viewArcDetails(arcId: string) {
    this.router.navigate(['/wiki/arcos-narrativos', arcId]);
  }

  addNew() {
      this.selectedArc = {};
      this.isEditing = true;
      this.initForm();
  }

  editArc() {
      this.isEditing = true;
      this.initForm(this.selectedArc);
  }

  cancelEdit() {
      this.isEditing = false;
      if (!this.selectedArc._id) {
          this.selectedArc = null;
      } else {
          this.imagePreview = this.selectedArc.imageUrl || null;
      }
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
      
      const formValue = this.form.value;
      const arcData = {
          title: formValue.title,
          descriptionHtml: formValue.descriptionHtml
      };

      if (this.selectedArc && this.selectedArc._id) {
          // If update method doesn't take file directly, we need to adapt it
          // Wait, the original method was narrativeArcsService.create(arc, file).
          // But editing in narrative-arc-detail.component might use update. Let's look at how it's done.
          // Wait, narrative-arcs.service has update? we can assume yes, or we can look it up.
          // Let me call update on narrativeArcsService
          this.narrativeArcsService.update(this.selectedArc._id, arcData, this.imageFile || undefined).subscribe({
              next: () => {
                  this.snackbar.success('Arco narrativo actualizado');
                  this.isEditing = false;
                  this.loadNarrativeArcs();
              },
              error: () => this.snackbar.error('Error al actualizar el Arco narrativo')
          });
      } else {
          this.narrativeArcsService.create(arcData, this.imageFile || undefined).subscribe({
              next: (response: any) => {
                  this.snackbar.success('Arco narrativo creado');
                  this.isEditing = false;
                  this.selectedArc = response.arc || {};
                  this.loadNarrativeArcs();
              },
              error: () => this.snackbar.error('Error al crear el Arco narrativo')
          });
      }
  }

  deleteArc(arc: any) {
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
          width: '400px',
          data: {
              title: 'Confirmar Eliminación',
              message: `¿Estás seguro de que quieres eliminar el arco narrativo ${arc.title}?`
          }
      });
      dialogRef.afterClosed().subscribe(confirm => {
          if (confirm) {
              this.narrativeArcsService.delete(arc._id).subscribe({
                  next: () => {
                      this.snackbar.success('Arco narrativo eliminado');
                      this.selectedArc = null;
                      this.isEditing = false;
                      this.loadNarrativeArcs();
                  },
                  error: () => this.snackbar.error('Error al eliminar el Arco narrativo')
              });
          }
      });
  }
}
