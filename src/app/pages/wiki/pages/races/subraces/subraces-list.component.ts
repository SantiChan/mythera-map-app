import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubracesService } from '../../../../../shared/services/wiki/subraces.service';
import { RacesService } from '../../../../../shared/services/wiki/races.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmModalComponent } from '../../narrative-arcs/modals/confirm-modal.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-subraces-list',
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
    templateUrl: './subraces-list.component.html',
    styleUrls: ['./subraces-list.component.scss']
})
export class SubracesListComponent implements OnInit {
    subraces: any[] = [];
    selectedSubrace: any = null;
    raceId: string = '';
    raceName: string = 'Raza';
    isEditing = false;
    
    form!: FormGroup;
    imageFile: File | null = null;
    imagePreview: string | null = null;

    constructor(
        private subracesService: SubracesService,
        private racesService: RacesService,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) { 
        this.initForm();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.raceId = params['id'];
            if (this.raceId) {
                this.loadRaceDetails();
                this.loadSubraces();
            }
        });
    }

    initForm(subrace?: any) {
        this.form = this.fb.group({
            name: [subrace?.name || '', Validators.required],
            description: [subrace?.description || ''],
            size: [subrace?.size || ''],
            age: [subrace?.age || ''],
            language: [subrace?.language || ''],
            speed: [subrace?.speed || ''],
            stats: this.fb.group({
                str: [subrace?.stats?.str || 0], 
                dex: [subrace?.stats?.dex || 0], 
                con: [subrace?.stats?.con || 0], 
                int: [subrace?.stats?.int || 0], 
                wis: [subrace?.stats?.wis || 0], 
                cha: [subrace?.stats?.cha || 0]
            }),
            passiveTraits: this.fb.array([]),
            activeTraits: this.fb.array([])
        });

        if (subrace?.passiveTraits?.length) {
            subrace.passiveTraits.forEach((t: any) => {
                const group = this.fb.group({
                    title: [t.title || '', Validators.required],
                    description: [t.description || '', Validators.required]
                });
                this.passiveTraits.push(group);
            });
        }
        
        if (subrace?.activeTraits?.length) {
            subrace.activeTraits.forEach((t: any) => {
                const group = this.fb.group({
                    title: [t.title || '', Validators.required],
                    description: [t.description || '', Validators.required]
                });
                this.activeTraits.push(group);
            });
        }

        this.imageFile = null;
        this.imagePreview = subrace?.imageUrl || null;
    }

    get passiveTraits() { return this.form.get('passiveTraits') as FormArray; }
    get activeTraits() { return this.form.get('activeTraits') as FormArray; }

    addPassiveTrait() {
        this.passiveTraits.push(this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] }));
    }
    removePassiveTrait(idx: number) { this.passiveTraits.removeAt(idx); }

    addActiveTrait() {
        this.activeTraits.push(this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] }));
    }
    removeActiveTrait(idx: number) { this.activeTraits.removeAt(idx); }

    loadRaceDetails() {
        this.racesService.getRace(this.raceId).subscribe({
            next: (race: any) => {
                if (race) this.raceName = race.name;
            },
            error: () => this.snackbar.error('Error al cargar información de la raza')
        })
    }

    loadSubraces() {
        this.subracesService.getSubracesByRace(this.raceId).subscribe({
            next: (data) => {
                this.subraces = data;
                if (this.selectedSubrace && this.selectedSubrace._id) {
                    const refreshed = this.subraces.find(s => s._id === this.selectedSubrace._id);
                    this.selectedSubrace = refreshed || null;
                }
            },
            error: (err) => console.error('Error loading subraces', err)
        });
    }

    selectSubrace(subrace: any) {
        this.selectedSubrace = subrace;
        this.isEditing = false;
        this.imagePreview = subrace.imageUrl || null;
    }

    goBack() {
        this.router.navigate(['/wiki/razas']);
    }

    addNew() {
        this.selectedSubrace = {};
        this.isEditing = true;
        this.initForm();
    }

    editSubrace() {
        this.isEditing = true;
        this.initForm(this.selectedSubrace);
    }

    cancelEdit() {
        this.isEditing = false;
        if (!this.selectedSubrace._id) {
            this.selectedSubrace = null;
        } else {
            this.imagePreview = this.selectedSubrace.imageUrl || null;
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

        // Append primitive fields
        ['name', 'description', 'size', 'age', 'language', 'speed'].forEach(field => {
            if (data[field]) formData.append(field, data[field]);
        });
        
        formData.append('raceId', this.raceId);

        // Append complex objects as JSON strings
        if (data.stats) formData.append('stats', JSON.stringify(data.stats));
        if (data.passiveTraits) formData.append('passiveTraits', JSON.stringify(data.passiveTraits));
        if (data.activeTraits) formData.append('activeTraits', JSON.stringify(data.activeTraits));

        if (this.imageFile) {
            formData.append('file', this.imageFile);
        }

        if (this.selectedSubrace && this.selectedSubrace._id) {
            this.subracesService.updateSubrace(this.selectedSubrace._id, formData).subscribe({
                next: () => {
                    this.snackbar.success('Subraza actualizada');
                    this.isEditing = false;
                    this.loadSubraces();
                },
                error: () => this.snackbar.error('Error al actualizar la subraza')
            });
        } else {
            this.subracesService.createSubrace(formData).subscribe({
                next: (created: any) => {
                    this.snackbar.success('Subraza creada');
                    this.isEditing = false;
                    this.selectedSubrace = created || {};
                    this.loadSubraces();
                },
                error: () => this.snackbar.error('Error al crear la subraza')
            });
        }
    }

    deleteSubrace(subrace: any) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: `¿Estás seguro de que quieres eliminar la subraza ${subrace.name}?`
            }
        });
        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.subracesService.deleteSubrace(subrace._id).subscribe({
                    next: () => {
                        this.snackbar.success('Subraza eliminada');
                        this.selectedSubrace = null;
                        this.isEditing = false;
                        this.loadSubraces();
                    },
                    error: () => this.snackbar.error('Error al eliminar la subraza')
                });
            }
        });
    }
}
