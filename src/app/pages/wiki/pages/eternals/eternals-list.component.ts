import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EternalsService } from '../../../../shared/services/wiki/eternals.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmModalComponent } from '../narrative-arcs/modals/confirm-modal.component';

@Component({
    selector: 'app-eternals-list',
    standalone: true,
    imports: [
        CommonModule, 
        MatDialogModule, 
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './eternals-list.component.html',
    styleUrls: ['./eternals-list.component.scss']
})
export class EternalsListComponent implements OnInit {
    eternals: any[] = [];
    selectedEternal: any = null;
    isEditing = false;
    
    form!: FormGroup;
    imageFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        private eternalsService: EternalsService,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private fb: FormBuilder
    ) { 
        this.initForm();
    }

    ngOnInit() {
        this.loadEternals();
    }

    initForm(eternal?: any) {
        this.form = this.fb.group({
            name: [eternal?.name || '', Validators.required],
            nickname: [eternal?.nickname || ''],
            presence: [eternal?.presence || ''],
            legend: [eternal?.legend || '']
        });

        this.imageFile = null;
        this.imagePreview = eternal?.imageUrl || null;
    }

    loadEternals() {
        this.eternalsService.getEternals().subscribe({
            next: (data) => {
                this.eternals = data;
                if (this.selectedEternal && this.selectedEternal._id) {
                    const refreshed = this.eternals.find(e => e._id === this.selectedEternal._id);
                    this.selectedEternal = refreshed || null;
                }
            },
            error: (err) => console.error('Error loading eternals', err)
        });
    }

    selectEternal(eternal: any) {
        this.selectedEternal = eternal;
        this.isEditing = false;
        this.imagePreview = eternal.imageUrl || null;
    }

    addNew() {
        this.selectedEternal = {};
        this.isEditing = true;
        this.initForm();
    }

    editEternal() {
        this.isEditing = true;
        this.initForm(this.selectedEternal);
    }

    cancelEdit() {
        this.isEditing = false;
        if (!this.selectedEternal._id) {
            this.selectedEternal = null;
        } else {
            this.imagePreview = this.selectedEternal.imageUrl || null;
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
        
        const formData = new FormData();
        const data = this.form.value;

        formData.append('name', data.name);
        formData.append('nickname', data.nickname || '');
        formData.append('presence', data.presence || '');
        formData.append('legend', data.legend || '');

        if (this.imageFile) {
            formData.append('file', this.imageFile);
        }

        if (this.selectedEternal && this.selectedEternal._id) {
            this.eternalsService.updateEternal(this.selectedEternal._id, formData).subscribe({
                next: () => {
                    this.snackbar.success('Eterno actualizado');
                    this.isEditing = false;
                    this.loadEternals();
                },
                error: () => this.snackbar.error('Error al actualizar el Eterno')
            });
        } else {
            this.eternalsService.createEternal(formData).subscribe({
                next: (created: any) => {
                    this.snackbar.success('Eterno creado');
                    this.isEditing = false;
                    this.selectedEternal = created || {};
                    this.loadEternals();
                },
                error: () => this.snackbar.error('Error al crear el Eterno')
            });
        }
    }

    deleteEternal(eternal: any) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: '¿Estás seguro de que quieres eliminar este Eterno?'
            }
        });
        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.eternalsService.deleteEternal(eternal._id).subscribe({
                    next: () => {
                        this.snackbar.success('Eterno eliminado');
                        this.selectedEternal = null;
                        this.isEditing = false;
                        this.loadEternals();
                    },
                    error: () => this.snackbar.error('Error al eliminar el Eterno')
                });
            }
        });
    }
}
