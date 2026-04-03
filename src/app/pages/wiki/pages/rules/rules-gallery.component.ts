import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { Rule, RulesService } from '../../../../core/services/wiki/rules.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-rules-gallery',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatTooltipModule,
    AngularEditorModule
  ],
  templateUrl: './rules-gallery.component.html',
  styleUrls: ['./rules-gallery.component.scss']
})
export class RulesGalleryComponent implements OnInit {
  rules: Rule[] = [];
  selectedRule: Rule | null = null;
  
  form: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isEditing = false;
  isNew = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '250px',
    placeholder: 'Redacta los detalles de la norma aquí...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    toolbarHiddenButtons: [['insertImage', 'insertVideo', 'backgroundColor']]
  };

  constructor(
    private rulesService: RulesService,
    private fb: FormBuilder,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      descriptionHtml: ['']
    });
  }

  ngOnInit() {
    this.loadRules();
  }

  loadRules() {
    this.rulesService.getRules().subscribe({
      next: (data) => this.rules = data,
      error: () => this.snackbar.error('Error al cargar las normas')
    });
  }

  selectRule(rule: Rule) {
    if (this.isEditing) return; // Prevent losing unsaved changes
    this.selectedRule = rule;
    this.isEditing = false;
    this.isNew = false;
  }

  addNew() {
    this.selectedRule = { name: '' };
    this.isNew = true;
    this.isEditing = true;
    this.imageFile = null;
    this.imagePreview = null;
    this.form.reset();
  }

  editRule() {
    if (!this.selectedRule) return;
    this.isEditing = true;
    this.isNew = false;
    this.form.patchValue({
      name: this.selectedRule.name,
      descriptionHtml: this.selectedRule.descriptionHtml
    });
    this.imagePreview = this.selectedRule.imageUrl || null;
    this.imageFile = null;
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.isNew) {
      this.selectedRule = null;
    }
    this.imageFile = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreview = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  save() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('name', this.form.value.name);
    if (this.form.value.descriptionHtml) {
        formData.append('descriptionHtml', this.form.value.descriptionHtml);
    }
    if (this.imageFile) {
        formData.append('file', this.imageFile);
    }

    if (this.isNew) {
      this.rulesService.createRule(formData).subscribe({
        next: (created) => {
          this.rules.push(created);
          this.selectedRule = created;
          this.isEditing = false;
          this.snackbar.success('Norma creada');
        },
        error: () => this.snackbar.error('Error al crear la norma')
      });
    } else if (this.selectedRule && this.selectedRule._id) {
      this.rulesService.updateRule(this.selectedRule._id, formData).subscribe({
        next: (updated) => {
          const index = this.rules.findIndex(r => r._id === updated._id);
          if (index !== -1) {
             this.rules[index] = updated;
             this.selectedRule = updated;
          }
          this.isEditing = false;
          this.snackbar.success('Norma actualizada');
        },
        error: () => this.snackbar.error('Error al actualizar la norma')
      });
    }
  }

  deleteRule(rule: Rule) {
    if (!rule._id) return;
    if (confirm('¿Estás seguro de que quieres eliminar esta norma de la mesa?')) {
      this.rulesService.deleteRule(rule._id).subscribe({
        next: () => {
          this.rules = this.rules.filter(r => r._id !== rule._id);
          this.selectedRule = null;
          this.isEditing = false;
          this.snackbar.success('Norma eliminada');
        },
        error: () => this.snackbar.error('Error al eliminar norma')
      });
    }
  }
}
