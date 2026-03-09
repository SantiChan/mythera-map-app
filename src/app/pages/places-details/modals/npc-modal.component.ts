import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { Npc } from '../../../shared/interfaces/places/npc.interface';
import { NpcEditCardData } from '../interfaces/cards.interface';

@Component({
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
    templateUrl: './npc-modal.component.html',
    styleUrls: ['./npc-modal.component.scss'],
})
export class NpcModalComponent implements OnInit {
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '200px',
        translate: 'no',
        toolbarHiddenButtons: [
            ['insertVideo', 'toggleEditorMode']
        ],
    };

    editMode: boolean = false;
    selectedFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        public dialogRef: MatDialogRef<NpcModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: NpcEditCardData
    ) { }

    ngOnInit(): void {
        this.editMode = this.data.newNpc || false;
        this.imagePreview = this.data.npc.image || null;
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
        // The image is already loaded in imagePreview, just clear the selectedFile flag
        // The actual file will be sent when saving
    }

    close() {
        this.dialogRef.close();
    }

    save() {
        if (this.data.newNpc && !this.selectedFile && !this.data.npc.image) {
            return;
        }

        this.dialogRef.close({ npc: this.data.npc, file: this.selectedFile });
    }

    back() {
        this.editMode = false;
    }
}
