import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GodsService } from '../../../../shared/services/wiki/gods.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmModalComponent } from '../narrative-arcs/modals/confirm-modal.component';

@Component({
    selector: 'app-gods-list',
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
    templateUrl: './gods-list.component.html',
    styleUrls: ['./gods-list.component.scss']
})
export class GodsListComponent implements OnInit {
    gods: any[] = [];
    selectedGod: any = null;
    isEditing = false;
    
    form!: FormGroup;
    imageFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        private godsService: GodsService,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private fb: FormBuilder
    ) { 
        this.initForm();
    }

    ngOnInit() {
        this.loadGods();
    }

    initForm(god?: any) {
        this.form = this.fb.group({
            name: [god?.name || '', Validators.required],
            nickname: [god?.nickname || ''],
            domain: [god?.domain || ''],
            legend: [god?.legend || ''],
            prayers: this.fb.array([])
        });

        if (god?.prayers?.length) {
            god.prayers.forEach((p: string) => {
                this.prayers.push(this.fb.control(p));
            });
        }

        this.imageFile = null;
        this.imagePreview = god?.imageUrl || null;
    }

    get prayers() { return this.form.get('prayers') as FormArray; }

    addPrayer() { this.prayers.push(this.fb.control('')); }
    removePrayer(index: number) { this.prayers.removeAt(index); }

    loadGods() {
        this.godsService.getGods().subscribe({
            next: (data) => {
                this.gods = data;
                if (this.selectedGod && this.selectedGod._id) {
                    const refreshed = this.gods.find(g => g._id === this.selectedGod._id);
                    this.selectedGod = refreshed || null;
                }
            },
            error: (err) => console.error('Error loading gods', err)
        });
    }

    selectGod(god: any) {
        this.selectedGod = god;
        this.isEditing = false;
        this.imagePreview = god.imageUrl || null;
    }

    addNew() {
        this.selectedGod = {};
        this.isEditing = true;
        this.initForm();
    }

    editGod() {
        this.isEditing = true;
        this.initForm(this.selectedGod);
    }

    cancelEdit() {
        this.isEditing = false;
        if (!this.selectedGod._id) {
            this.selectedGod = null;
        } else {
            this.imagePreview = this.selectedGod.imageUrl || null;
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
        formData.append('domain', data.domain || '');
        formData.append('legend', data.legend || '');
        formData.append('prayers', JSON.stringify(data.prayers || []));

        if (this.imageFile) {
            formData.append('file', this.imageFile);
        }

        if (this.selectedGod && this.selectedGod._id) {
            this.godsService.updateGod(this.selectedGod._id, formData).subscribe({
                next: () => {
                    this.snackbar.success('Dios actualizado');
                    this.isEditing = false;
                    this.loadGods();
                },
                error: () => this.snackbar.error('Error al actualizar el Dios')
            });
        } else {
            this.godsService.createGod(formData).subscribe({
                next: (created: any) => {
                    this.snackbar.success('Dios creado');
                    this.isEditing = false;
                    this.selectedGod = created || {};
                    this.loadGods();
                },
                error: () => this.snackbar.error('Error al crear el Dios')
            });
        }
    }

    deleteGod(god: any) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: '¿Estás seguro de que quieres eliminar este Dios?'
            }
        });
        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.godsService.deleteGod(god._id).subscribe({
                    next: () => {
                        this.snackbar.success('Dios eliminado');
                        this.selectedGod = null;
                        this.isEditing = false;
                        this.loadGods();
                    },
                    error: () => this.snackbar.error('Error al eliminar el Dios')
                });
            }
        });
    }
}
