import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ConfirmModalComponent } from '../narrative-arcs/modals/confirm-modal.component';
import { CharactersService } from '../../../../core/services/wiki/characters.service';
import { SubracesService } from '../../../../shared/services/wiki/subraces.service';
import { PlaceService } from '../../../../shared/services/places.service';
import { GodsService } from '../../../../shared/services/wiki/gods.service';
import { Character } from '../../../../core/models/wiki/character.model';

@Component({
    selector: 'app-characters-list',
    standalone: true,
    imports: [
        CommonModule, 
        MatDialogModule, 
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    templateUrl: './characters-list.component.html',
    styleUrls: ['./characters-list.component.scss']
})
export class CharactersListComponent implements OnInit {
    characters: any[] = [];
    selectedCharacter: any = null;
    isEditing = false;

    form!: FormGroup;
    imageFile: File | null = null;
    imagePreview: string | null = null;

    subraces: any[] = [];
    places: any[] = [];
    gods: any[] = [];

    constructor(
        private charactersService: CharactersService,
        private dialog: MatDialog,
        private snackbar: SnackbarService,
        private fb: FormBuilder,
        private subracesService: SubracesService,
        private placeService: PlaceService,
        private godsService: GodsService
    ) {
        this.initForm();
    }

    ngOnInit() {
        this.loadCharacters();
        this.loadDependencies();
    }

    loadDependencies() {
        this.subracesService.getSubraces().subscribe((data: any) => this.subraces = data);
        this.placeService.getPlaces().subscribe((data: any) => this.places = data);
        this.godsService.getGods().subscribe((data: any) => this.gods = data);
    }

    initForm(character?: any) {
        this.form = this.fb.group({
            characterName: [character?.characterName || '', Validators.required],
            playerName: [character?.playerName || '', Validators.required],
            subraceId: [character?.subraceId?._id || character?.subraceId || ''],
            currentPlaceId: [character?.currentPlaceId?._id || character?.currentPlaceId || ''],
            deitiesIds: [character?.deitiesIds?.map((d: any) => d._id || d) || []],
            backstory: [character?.backstory || ''],
            eventsAndAchievements: this.fb.array([]),
            plotItems: this.fb.array([])
        });

        if (character?.eventsAndAchievements?.length) {
            character.eventsAndAchievements.forEach((item: string) => {
                this.eventsAndAchievements.push(this.fb.control(item));
            });
        }

        if (character?.plotItems?.length) {
            character.plotItems.forEach((item: string) => {
                this.plotItems.push(this.fb.control(item));
            });
        }

        this.imageFile = null;
        this.imagePreview = character?.imageUrl || null;
    }

    get eventsAndAchievements() { return this.form.get('eventsAndAchievements') as FormArray; }
    get plotItems() { return this.form.get('plotItems') as FormArray; }

    addEvent() { this.eventsAndAchievements.push(this.fb.control('')); }
    removeEvent(index: number) { this.eventsAndAchievements.removeAt(index); }
    addPlotItem() { this.plotItems.push(this.fb.control('')); }
    removePlotItem(index: number) { this.plotItems.removeAt(index); }

    loadCharacters() {
        this.charactersService.getCharacters().subscribe({
            next: (data) => {
                this.characters = data;
            },
            error: (err) => console.error('Error loading characters', err)
        });
    }

    selectCharacter(character: any) {
        this.selectedCharacter = character;
        this.isEditing = false;
        this.imagePreview = character.imageUrl || null;
    }

    addNew() {
        this.selectedCharacter = {};
        this.isEditing = true;
        this.initForm();
    }

    editCharacter() {
        this.isEditing = true;
        this.initForm(this.selectedCharacter);
    }

    cancelEdit() {
        this.isEditing = false;
        if (!this.selectedCharacter._id) {
            this.selectedCharacter = null;
        } else {
            // Restore preview image
            this.imagePreview = this.selectedCharacter.imageUrl || null;
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
        ['characterName', 'playerName', 'subraceId', 'currentPlaceId', 'backstory'].forEach(field => {
            if (data[field]) formData.append(field, data[field]);
        });

        // Append arrays
        if (data.deitiesIds) formData.append('deitiesIds', JSON.stringify(data.deitiesIds));
        if (data.eventsAndAchievements) formData.append('eventsAndAchievements', JSON.stringify(data.eventsAndAchievements));
        if (data.plotItems) formData.append('plotItems', JSON.stringify(data.plotItems));

        if (this.imageFile) {
            formData.append('file', this.imageFile);
        }

        if (this.selectedCharacter && this.selectedCharacter._id) {
            this.charactersService.updateCharacter(this.selectedCharacter._id, formData).subscribe({
                next: () => {
                    this.snackbar.success('Personaje actualizado');
                    this.isEditing = false;
                    this.loadCharacters();
                },
                error: () => this.snackbar.error('Error al actualizar el personaje')
            });
        } else {
            this.charactersService.createCharacter(formData).subscribe({
                next: (created) => {
                    this.snackbar.success('Personaje creado');
                    this.isEditing = false;
                    this.selectedCharacter = created;
                    // We must refetch or just wait
                    this.loadCharacters();
                },
                error: () => this.snackbar.error('Error al crear el personaje')
            });
        }
    }

    deleteCharacter(character: any) {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '400px',
            data: {
                title: 'Confirmar Eliminación',
                message: `¿Estás seguro de que quieres eliminar al personaje ${character.playerName}?`
            }
        });
        dialogRef.afterClosed().subscribe(confirm => {
            if (confirm) {
                this.charactersService.deleteCharacter(character._id).subscribe({
                    next: () => {
                        this.snackbar.success('Personaje eliminado');
                        this.selectedCharacter = null;
                        this.isEditing = false;
                        this.loadCharacters();
                    },
                    error: () => this.snackbar.error('Error al eliminar el personaje')
                });
            }
        });
    }
}
