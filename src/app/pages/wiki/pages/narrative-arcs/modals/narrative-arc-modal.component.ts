import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-narrative-arc-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AngularEditorModule,
  ],
  templateUrl: './narrative-arc-modal.component.html',
  styleUrls: ['./narrative-arc-modal.component.scss']
})
export class NarrativeArcModalComponent implements OnInit {
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '200px',
    translate: 'no',
    toolbarHiddenButtons: [['insertVideo', 'toggleEditorMode']],
  };

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<NarrativeArcModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.imagePreview = this.data.arc?.imageUrl || null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  confirmImageChange() {
    // Image is already loaded in preview
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close({ 
      arc: this.data.arc, 
      file: this.selectedFile 
    });
  }
}
