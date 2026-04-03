import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RacesService } from '../../../../shared/services/wiki/races.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmModalComponent } from '../narrative-arcs/modals/confirm-modal.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-races-gallery',
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
    templateUrl: './races-gallery.component.html',
    styleUrls: ['./races-gallery.component.scss']
})
export class RacesGalleryComponent implements OnInit {
    races: any[] = [];
    selectedRace: any = null;
    isEditing = false;

    form!: FormGroup;
    imageFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        private racesService: RacesService,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private fb: FormBuilder,
        private router: Router
    ) { 
        this.initForm();
    }

    ngOnInit() {
        this.loadRaces();
    }

    initForm(race?: any) {
        this.form = this.fb.group({
            name: [race?.name || '', Validators.required],
            description: [race?.description || '']
        });

        this.imageFile = null;
        this.imagePreview = race?.imageUrl || null;
    }

    loadRaces() {
        this.racesService.getRaces().subscribe({
            next: (data) => {
                this.races = data;
                if (this.selectedRace && this.selectedRace._id) {
                    const refreshed = this.races.find(r => r._id === this.selectedRace._id);
                    this.selectedRace = refreshed || null;
                }
            },
            error: (err) => console.error('Error loading races', err)
        });
    }

    selectRace(race: any) {
        this.selectedRace = race;
        this.isEditing = false;
        this.imagePreview = race.imageUrl || null;
    }

    goToSubraces(raceId: string) {
        this.router.navigate(['/wiki/razas', raceId]);
    }

    addNew() {
        this.selectedRace = {};
        this.isEditing = true;
        this.initForm();
    }

    editRace() {
        this.isEditing = true;
        this.initForm(this.selectedRace);
    }

    cancelEdit() {
        this.isEditing = false;
        if (!this.selectedRace._id) {
            this.selectedRace = null;
        } else {
            this.imagePreview = this.selectedRace.imageUrl || null;
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
        formData.append('description', data.description || '');

        if (this.imageFile) {
            formData.append('file', this.imageFile);
        }

        if (this.selectedRace && this.selectedRace._id) {
            this.racesService.updateRace(this.selectedRace._id, formData).subscribe({
                next: () => {
                    this.snackbar.success('Raza actualizada');
                    this.isEditing = false;
                    this.loadRaces();
                },
                error: () => this.snackbar.error('Error al actualizar la raza')
            });
        } else {
            this.racesService.createRace(formData).subscribe({
                next: (created: any) => {
                    this.snackbar.success('Raza creada');
                    this.isEditing = false;
                    this.selectedRace = created || {};
                    this.loadRaces();
                },
                error: () => this.snackbar.error('Error al crear la raza')
            });
        }
    }

    deleteRace(race: any) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: '¿Estás seguro de que quieres eliminar esta Raza Principal? Se perderán todas sus subrazas.'
            }
        });
        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.racesService.deleteRace(race._id).subscribe({
                    next: () => {
                        this.snackbar.success('Raza eliminada');
                        this.selectedRace = null;
                        this.isEditing = false;
                        this.loadRaces();
                    },
                    error: () => this.snackbar.error('Error al eliminar la Raza')
                });
            }
        });
    }
}
