import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-session-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    AngularEditorModule
  ],
  templateUrl: './session-modal.component.html',
  styleUrls: ['./session-modal.component.scss']
})
export class SessionModalComponent implements OnInit {
  sessionForm: FormGroup;
  sessionTypes = ['Campaña', 'Quest', 'Oneshot', 'Bishot'];

  editorConfig = {
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
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SessionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { session?: any }
  ) {
    this.sessionForm = this.fb.group({
      title: ['', Validators.required],
      type: ['Campaña', Validators.required],
      startLevel: ['', Validators.required],
      players: this.fb.array([]),
      contents: this.fb.array([])
    });
  }

  ngOnInit() {
    if (this.data.session) {
      this.sessionForm.patchValue({
        title: this.data.session.title,
        type: this.data.session.type,
        startLevel: this.data.session.startLevel
      });

      if (this.data.session.players?.length) {
        this.data.session.players.forEach((player: any) => {
          this.addPlayer(player);
        });
      }

      if (this.data.session.contents?.length) {
        this.data.session.contents.forEach((content: any) => {
          this.addContent(content);
        });
      }
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

  save() {
    if (this.sessionForm.valid) {
      this.dialogRef.close(this.sessionForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
