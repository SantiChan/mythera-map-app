import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ConfirmModalComponent } from '../narrative-arcs/modals/confirm-modal.component';
import { FactionsService } from '../../../../core/services/wiki/factions.service';
import { Faction } from '../../../../core/models/wiki/faction.model';
import { PlaceService } from '../../../../shared/services/places.service';
import { NpcsService } from '../../../../core/services/wiki/npcs.service';
import { NpcModalComponent } from './modals/npc-modal.component';

@Component({
    selector: 'app-factions-list',
    standalone: true,
    imports: [
        CommonModule, 
        MatDialogModule, 
        MatIconModule, 
        MatTooltipModule, 
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    templateUrl: './factions-list.component.html',
    styleUrls: ['./factions-list.component.scss']
})
export class FactionsListComponent implements OnInit {
    factions: Faction[] = [];
    selectedFaction: any = null;
    isEditing = false;

    form!: FormGroup;
    imageFile: File | null = null;
    imagePreview: string | null = null;
    places: any[] = [];
    npcs: any[] = [];

    constructor(
        private factionsService: FactionsService,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private fb: FormBuilder,
        private placeService: PlaceService,
        private npcsService: NpcsService
    ) { 
        this.initForm();
    }

    ngOnInit() {
        this.loadFactions();
        this.loadDependencies();
    }

    loadDependencies() {
        this.placeService.getPlaces().subscribe((data: any) => this.places = data);
        this.loadNpcs();
    }

    loadNpcs() {
        this.npcsService.getNpcs().subscribe((data: any) => {
            this.npcs = data;
        });
    }

    initForm(faction?: any) {
        this.form = this.fb.group({
            name: [faction?.name || '', Validators.required],
            type: [faction?.type || ''],
            placesIds: [faction?.placesIds?.map((d: any) => d._id || d) || []],
            npcIds: [faction?.npcIds?.map((d: any) => d._id || d) || []],
            descriptionHtml: [faction?.descriptionHtml || ''],
            ranks: this.fb.array([]),
            factionTraits: this.fb.array([]),
            troops: this.fb.array([])
        });

        if (faction?.ranks?.length) {
            faction.ranks.forEach((item: any) => {
                this.ranks.push(this.fb.group({ title: [item.title, Validators.required], description: [item.description, Validators.required] }));
            });
        }

        if (faction?.factionTraits?.length) {
            faction.factionTraits.forEach((item: any) => {
                this.factionTraits.push(this.fb.group({ title: [item.title, Validators.required], description: [item.description, Validators.required] }));
            });
        }

        if (faction?.troops?.length) {
            faction.troops.forEach((item: any) => {
                this.troops.push(this.fb.group({ name: [item.name, Validators.required], quantity: [item.quantity, Validators.required] }));
            });
        }

        this.imageFile = null;
        this.imagePreview = faction?.imageUrl || null;
    }

    get ranks() { return this.form.get('ranks') as FormArray; }
    get factionTraits() { return this.form.get('factionTraits') as FormArray; }
    get troops() { return this.form.get('troops') as FormArray; }

    addRank() { this.ranks.push(this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] })); }
    removeRank(index: number) { this.ranks.removeAt(index); }

    addTrait() { this.factionTraits.push(this.fb.group({ title: ['', Validators.required], description: ['', Validators.required] })); }
    removeTrait(index: number) { this.factionTraits.removeAt(index); }

    addTroop() { this.troops.push(this.fb.group({ name: ['', Validators.required], quantity: [1, Validators.required] })); }
    removeTroop(index: number) { this.troops.removeAt(index); }

    loadFactions() {
        this.factionsService.getFactions().subscribe({
            next: (data) => {
                this.factions = data;
            },
            error: (err) => console.error('Error loading factions', err)
        });
    }

    selectFaction(faction: Faction) {
        this.selectedFaction = faction;
        this.isEditing = false;
        this.imagePreview = faction.imageUrl || null;
    }

    addNew() {
        this.selectedFaction = {};
        this.isEditing = true;
        this.initForm();
    }

    editFaction() {
        this.isEditing = true;
        this.initForm(this.selectedFaction);
    }

    cancelEdit() {
        this.isEditing = false;
        if (!this.selectedFaction._id) {
            this.selectedFaction = null;
        } else {
            this.imagePreview = this.selectedFaction.imageUrl || null;
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

    openCreateNpcModal() {
        const dialogRef = this.dialog.open(NpcModalComponent, {
            width: '600px',
            data: { isSubModal: true }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadNpcs();
                
                if (result._id) {
                    const currentNpcIds = this.form.get('npcIds')?.value || [];
                    this.form.patchValue({ npcIds: [...currentNpcIds, result._id] });
                }

                this.snackbar.success('PNJ Creado y añadido a la lista.');
            }
        });
    }

    openNpcDetails(npc: any) {
        this.dialog.open(NpcModalComponent, {
            width: '600px',
            data: { isSubModal: true, isReadonly: true, npc }
        });
    }

    save() {
        if (this.form.invalid) return;
        
        const formData = new FormData();
        const data = this.form.value;

        ['name', 'type', 'descriptionHtml'].forEach(field => {
            if (data[field]) formData.append(field, data[field]);
        });

        if (data.placesIds) formData.append('placesIds', JSON.stringify(data.placesIds));
        if (data.npcIds) formData.append('npcIds', JSON.stringify(data.npcIds));
        if (data.ranks) formData.append('ranks', JSON.stringify(data.ranks));
        if (data.factionTraits) formData.append('factionTraits', JSON.stringify(data.factionTraits));
        if (data.troops) formData.append('troops', JSON.stringify(data.troops));

        if (this.imageFile) {
            formData.append('file', this.imageFile);
        }

        if (this.selectedFaction && this.selectedFaction._id) {
            this.factionsService.updateFaction(this.selectedFaction._id, formData).subscribe({
                next: () => {
                    this.snackbar.success('Organización actualizada');
                    this.isEditing = false;
                    this.factionsService.getFactions().subscribe(data => {
                        this.factions = data;
                        this.selectedFaction = this.factions.find((f: any) => f._id === this.selectedFaction._id) || this.selectedFaction;
                    });
                },
                error: () => this.snackbar.error('Error al actualizar la organización')
            });
        } else {
            this.factionsService.createFaction(formData).subscribe({
                next: (created) => {
                    this.snackbar.success('Organización creada');
                    this.isEditing = false;
                    this.factionsService.getFactions().subscribe(data => {
                        this.factions = data;
                        this.selectedFaction = created && created._id ? (this.factions.find((f: any) => f._id === created._id) || created) : {};
                    });
                },
                error: () => this.snackbar.error('Error al crear la organización')
            });
        }
    }

    deleteFaction(faction: Faction) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: `¿Estás seguro de que quieres eliminar la organización ${faction.name}?`
            }
        });
        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm && faction._id) {
                this.factionsService.deleteFaction(faction._id).subscribe({
                    next: () => {
                        this.snackbar.success('Organización eliminada');
                        this.selectedFaction = null;
                        this.isEditing = false;
                        this.loadFactions();
                    },
                    error: () => this.snackbar.error('Error al eliminar la organización')
                });
            }
        });
    }
}
