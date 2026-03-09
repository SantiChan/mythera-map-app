import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AngularEditorModule, AngularEditorConfig } from '@kolkov/angular-editor';
import { NpcModalComponent } from './modals/npc-modal.component';
import { Card, NamedItem } from './interfaces/cards.interface';
import { Npc } from '../../shared/interfaces/places/npc.interface';
import { PlaceService } from '../../shared/services/places.service';
import { SnackbarService } from '../../shared/services/snackbar.service';


@Component({
  selector: 'app-places-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    AngularEditorModule,
  ],
  templateUrl: './places-details.component.html',
  styleUrl: './places-details.component.scss',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class PlacesDetailsComponent implements OnInit {
  placeId: string = '';
  placeData: any = null;
  selected = 0;
  isEditing = false;
  editingPlaceOfInterest: any = null;
  editingObject: any = null;
  editingArmy: any = null;
  selectedImage: File | null = null;

  flippedNpcIds = new Set<string>();

  placeForm = { name: '', description: '' };
  objectForm = { name: '', description: '' };
  armyForm = { name: '', description: '' };

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '220px',
    translate: 'no',
    toolbarHiddenButtons: [
      ['insertVideo', 'toggleEditorMode']
    ],
  };

  cards: Card[] = [
    {
      type: 'description',
      title: 'Descripción',
      image: 'assets/place-details/goverment-icon.png',
      descriptionHtml: '',
    },
    {
      type: 'creatures',
      title: 'Criaturas',
      image: 'assets/place-details/goverment-icon.png',
      creatures: '',
      legendaryCreatures: '',
      objects: [],
      army: [],
    },
    {
      type: 'places',
      title: 'Sitios de Interés',
      image: 'assets/place-details/goverment-icon.png',
      placesOfInterest: [],
    },
    {
      type: 'npcs',
      title: 'Pnjs Relevantes',
      image: 'assets/place-details/goverment-icon.png',
      npcs: [],
    },
  ];

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.placeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPlaceDetails();
  }

  goBackToMap() {
    this.router.navigate(['/']);
  }

  loadPlaceDetails() {
    if (!this.placeId) {
      console.error('No place ID provided');
      return;
    }

    this.placeService.getPlaceDetails(this.placeId).subscribe({
      next: (place) => {
        this.placeData = place;
        this.populateCards(place);
      },
      error: (err) => {
        console.error('Error cargando lugar:', err);
        this.snackbar.error('Error al cargar el lugar');
      }
    });
  }

  populateCards(placeData: any) {
    const descCard = this.cards.find(c => c.type === 'description');
    if (descCard && descCard.type === 'description') {
      descCard.descriptionHtml = placeData?.details?.descriptionHtml || '';
    }

    const creaturesCard = this.cards.find(c => c.type === 'creatures');
    if (creaturesCard && creaturesCard.type === 'creatures') {
      creaturesCard.creatures = placeData?.details?.creatures || '';
      creaturesCard.legendaryCreatures = placeData?.details?.legendaryCreatures || '';
      creaturesCard.objects = placeData?.details?.objects || [];
      creaturesCard.army = placeData?.details?.army || [];
    }

    const placesCard = this.cards.find(c => c.type === 'places');
    if (placesCard && placesCard.type === 'places') {
      placesCard.placesOfInterest = placeData?.details?.placesOfInterest || [];
    }

    const npcsCard = this.cards.find(c => c.type === 'npcs');
    if (npcsCard && npcsCard.type === 'npcs') {
      npcsCard.npcs = placeData?.details?.npcs || [];
    }
  }

  get current(): Card {
    return this.cards[this.selected];
  }

  get descriptionCard() {
    return this.current.type === 'description' ? this.current : null;
  }

  get creaturesCard() {
    return this.current.type === 'creatures' ? this.current : null;
  }

  get placesCard() {
    return this.current.type === 'places' ? this.current : null;
  }

  get npcsCard() {
    return this.current.type === 'npcs' ? this.current : null;
  }

  selectTab(index: number) {
    this.selected = index;
    this.isEditing = false;
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        if (this.placeData) {
          this.placeData.imageUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveImage() {
    if (!this.selectedImage || !this.placeId) return;

    this.placeService.updatePlaceImage(this.placeId, this.selectedImage).subscribe({
      next: (response) => {
        this.placeData.imageUrl = response.place.imageUrl;
        this.selectedImage = null;
        this.snackbar.success('Imagen actualizada');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al actualizar imagen');
      }
    });
  }

  saveDescription() {
    const card = this.descriptionCard;
    
    if (!card || !this.placeId) return;

    this.placeService.updateDescription(this.placeId, card.descriptionHtml).subscribe({
      next: () => {
        this.isEditing = false;
        this.snackbar.success('Descripción guardada');
      },
      error: (err) => {
        console.error('Error saving description:', err);
        this.snackbar.error('Error al guardar descripción');
      }
    });
  }

  saveCreatures() {
    const card = this.creaturesCard;
    
    if (!card || !this.placeId) return;

    this.placeService.updateCreatures(this.placeId, {
      creatures: card.creatures,
      legendaryCreatures: card.legendaryCreatures
    }).subscribe({
      next: () => {
        this.snackbar.success('Criaturas guardadas');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al guardar criaturas');
      }
    });
  }

  resetPlaceForm() {
    this.placeForm = { name: '', description: '' };
  }

  resetObjectForm() {
    this.objectForm = { name: '', description: '' };
  }

  resetArmyForm() {
    this.armyForm = { name: '', description: '' };
  }

  addNamedItem(list: NamedItem[]) {
    const name = (this.placeForm.name ?? '').trim();
    const description = (this.placeForm.description ?? '').trim();
    if (!name) return;

    if (this.editingPlaceOfInterest) {
      this.savePlaceOfInterestEdit(name, description);
      return;
    }

    if (!this.placeId) return;

    this.placeService.addPlaceOfInterest(this.placeId, { name, description }).subscribe({
      next: (created) => {
        const card = this.placesCard;
        if (card) {
          card.placesOfInterest.push(created);
        }
        this.resetPlaceForm();
        this.snackbar.success('Lugar de interés añadido');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al añadir lugar de interés');
      }
    });
  }

  addObject() {
    const name = (this.objectForm.name ?? '').trim();
    const description = (this.objectForm.description ?? '').trim();
    
    if (!name || !this.placeId) return;

    if (this.editingObject) {
      this.saveObjectEdit(name, description);
      return;
    }

    this.placeService.addObject(this.placeId, { name, description }).subscribe({
      next: (created) => {
        const card = this.creaturesCard;
        if (card) {
          card.objects.push(created);
        }
        this.resetObjectForm();
        this.snackbar.success('Objeto añadido');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al añadir objeto');
      }
    });
  }

  editObject(item: any) {
    this.editingObject = item;
    this.objectForm.name = item.name;
    this.objectForm.description = item.description;
  }

  saveObjectEdit(name: string, description: string) {
    if (!this.placeId || !this.editingObject._id) {
      this.snackbar.error('No se puede editar: falta ID');
      return;
    }

    this.placeService.updateObject(
      this.placeId,
      this.editingObject._id,
      { name, description }
    ).subscribe({
      next: (updated) => {
        this.editingObject.name = updated.name;
        this.editingObject.description = updated.description;
        this.editingObject = null;
        this.resetObjectForm();
        this.snackbar.success('Objeto actualizado');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al actualizar objeto');
      }
    });
  }

  cancelObjectEdit() {
    this.editingObject = null;
    this.resetObjectForm();
  }

  deleteObject(item: any) {
    if (!this.placeId || !item._id) {
      this.snackbar.error('No se puede borrar: falta ID');
      return;
    }

    this.placeService.deleteObject(this.placeId, item._id).subscribe({
      next: () => {
        const card = this.creaturesCard;
        if (card) {
          const idx = card.objects.findIndex(o => o === item);
          if (idx >= 0) card.objects.splice(idx, 1);
        }
        this.snackbar.success('Objeto eliminado');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al eliminar objeto');
      }
    });
  }

  addArmy() {
    const name = (this.armyForm.name ?? '').trim();
    const description = (this.armyForm.description ?? '').trim();
    
    if (!name || !this.placeId) return;

    if (this.editingArmy) {
      this.saveArmyEdit(name, description);
      return;
    }

    this.placeService.addArmy(this.placeId, { name, description }).subscribe({
      next: (created) => {
        const card = this.creaturesCard;
        if (card) {
          card.army.push(created);
        }
        this.resetArmyForm();
        this.snackbar.success('Unidad añadida');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al añadir unidad');
      }
    });
  }

  editArmy(item: any) {
    this.editingArmy = item;
    this.armyForm.name = item.name;
    this.armyForm.description = item.description;
  }

  saveArmyEdit(name: string, description: string) {
    if (!this.placeId || !this.editingArmy._id) {
      this.snackbar.error('No se puede editar: falta ID');
      return;
    }

    this.placeService.updateArmy(
      this.placeId,
      this.editingArmy._id,
      { name, description }
    ).subscribe({
      next: (updated) => {
        this.editingArmy.name = updated.name;
        this.editingArmy.description = updated.description;
        this.editingArmy = null;
        this.resetArmyForm();
        this.snackbar.success('Unidad actualizada');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al actualizar unidad');
      }
    });
  }

  cancelArmyEdit() {
    this.editingArmy = null;
    this.resetArmyForm();
  }

  deleteArmy(item: any) {
    if (!this.placeId || !item._id) {
      this.snackbar.error('No se puede borrar: falta ID');
      return;
    }

    this.placeService.deleteArmy(this.placeId, item._id).subscribe({
      next: () => {
        const card = this.creaturesCard;
        if (card) {
          const idx = card.army.findIndex(a => a === item);
          if (idx >= 0) card.army.splice(idx, 1);
        }
        this.snackbar.success('Unidad eliminada');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al eliminar unidad');
      }
    });
  }

  editPlaceOfInterest(item: any) {
    this.editingPlaceOfInterest = item;
    this.placeForm.name = item.name;
    this.placeForm.description = item.description;
  }

  savePlaceOfInterestEdit(name: string, description: string) {
    if (!this.placeId || !this.editingPlaceOfInterest._id) {
      this.snackbar.error('No se puede editar: falta ID');
      return;
    }

    this.placeService.updatePlaceOfInterest(
      this.placeId,
      this.editingPlaceOfInterest._id,
      { name, description }
    ).subscribe({
      next: (updated) => {
        this.editingPlaceOfInterest.name = updated.name;
        this.editingPlaceOfInterest.description = updated.description;
        this.editingPlaceOfInterest = null;
        this.resetPlaceForm();
        this.snackbar.success('Lugar de interés actualizado');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al actualizar lugar de interés');
      }
    });
  }

  cancelPlaceOfInterestEdit() {
    this.editingPlaceOfInterest = null;
    this.resetPlaceForm();
  }

  deletePlaceOfInterest(item: any) {
    if (!this.placeId || !item._id) {
      this.snackbar.error('No se puede borrar: falta ID');
      return;
    }

    this.placeService.deletePlaceOfInterest(this.placeId, item._id).subscribe({
      next: () => {
        const card = this.placesCard;
        if (card) {
          const idx = card.placesOfInterest.findIndex(p => p === item);
          if (idx >= 0) card.placesOfInterest.splice(idx, 1);
        }
        this.snackbar.success('Lugar de interés eliminado');
      },
      error: (err) => {
        console.error(err);
        this.snackbar.error('Error al eliminar lugar de interés');
      }
    });
  }

  removeNamedItem(list: NamedItem[], index: number) {
    list.splice(index, 1);
  }

  saveEdit() {
    this.isEditing = false;
    this.resetPlaceForm();
    this.resetObjectForm();
    this.resetArmyForm();
  }

  toggleFlip(npcId: string) {
    if (this.flippedNpcIds.has(npcId)) this.flippedNpcIds.delete(npcId);
    else this.flippedNpcIds.add(npcId);
  }

  addNpc() {
    const card = this.current;
    if (card.type !== 'npcs') return;

    const newNpc: Npc = {
      id: (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`),
      name: '',
      title: '',
      descriptionHtml: '<p></p>',
      personality: '',
    };

    this.openNpcModal(newNpc, true);
  }

  openNpcModal(npc: Npc, newNpc: boolean = false) {
    const ref = this.dialog.open(NpcModalComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      panelClass: 'npc-modal-container',
      data: {
        newNpc: newNpc,
        npc: JSON.parse(JSON.stringify(npc)) as Npc
      }, 
    });

    ref.afterClosed().subscribe((result: any) => {
      if (!result) {
        // If cancelled and it was a new NPC, do nothing (don't add to list)
        return;
      }
      
      const card = this.current;
      if (card.type !== 'npcs') return;

      const npcData = result.npc;
      const file = result.file;

      if (newNpc) {
        this.placeService.addNpc(this.placeId, npcData, file).subscribe({
          next: (created) => {
            // Add the created NPC to the list
            card.npcs.push(created);
            this.snackbar.success('NPC añadido');
          },
          error: (err) => {
            console.error(err);
            this.snackbar.error('Error al añadir NPC');
          }
        });
      } else {
        if (!npcData._id) {
          this.snackbar.error('No se puede actualizar: falta ID');
          return;
        }

        this.placeService.updateNpc(this.placeId, npcData._id, npcData, file).subscribe({
          next: (updated) => {
            const idx = card.npcs.findIndex(x => x.id === npc.id);
            if (idx >= 0) {
              card.npcs[idx] = updated;
            }
            this.snackbar.success('NPC actualizado');
          },
          error: (err) => {
            console.error(err);
            this.snackbar.error('Error al actualizar NPC');
          }
        });
      }
    });
  }
}
