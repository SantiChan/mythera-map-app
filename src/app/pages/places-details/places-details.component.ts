import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


type FieldsMap = { [key: string]: string };

@Component({
  selector: 'app-places-details',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
    ,
  ],
  templateUrl: './places-details.component.html',
  styleUrl: './places-details.component.scss',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class PlacesDetailsComponent {
  selected = 0;
  isEditing = false;
  cards = [
    {
      title: 'Gobierno',
      image: 'assets/place-details/goverment-icon.png',
      fields: {
        nombreAsentamiento: 'Octaris',
        ubicacion: 'Costa del Desierto de Cobre (Cuerno de Avarna), bañado por Mareas Negras.',
        tipoAsentamiento: 'Metrópoli',
        tipoGobierno: 'Oligarquía mercantil',
        estructuraGobierno: 'Consejo (Rostro de la Fortuna)'
      } as FieldsMap
    },
    {
      title: 'Economía',
      image: 'assets/place-details/goverment-icon.png',
      fields: {
        productos: 'Especias, sedas, piedras preciosas, esclavos y artefactos exóticos',
        aliados: 'Kher - Semet',
        rutas: 'Rutas marítimas en Mareas Negras, rutas terrestres en el Desierto de Cobre',
        acuerdos: 'Esclavos (Kher - Semet), Especias y sedas (Velamar), Artefactos exóticos (Islas Meñique), Piedras preciosas (Kurfer)'
      } as FieldsMap
    },
    {
      title: 'Religión',
      image: 'assets/place-details/goverment-icon.png',
      fields: {
        raza: 'Cobre (Aunque hay influencia de diversas razas)',
        religion: 'Diversas (Aunque predomina la fe a Boaris)',
        fiestas: 'La Danza de las Especias'
      }
    },
    {
      title: 'Cultura',
      image: 'assets/place-details/goverment-icon.png',
      fields: {
        aliados: 'Kher - Semet',
        neutrales: 'Kurfer',
        enemigos: 'Desconfianza hacia las culturas nómadas del Desierto de Cobre (Nidos negros, entre otros)',
        ejercito: 'Peanas: A falta de establecer el modo',
        eventos: 'Búsqueda de la Fortuna: Tras el reciente surgimiento del Abismo en la Isla de Aldran...'
      } as FieldsMap
    }
  ];

  selectTab(index: number) {
    this.selected = index;
  }

  getFieldKeys(fields: FieldsMap): string[] {
    return Object.keys(fields);
  }

  getFieldValue(index: number, key: string): string {
    return (this.cards[index].fields as FieldsMap)[key] ?? '';
  }

  setFieldValue(index: number, key: string, value: string): void {
    (this.cards[index].fields as FieldsMap)[key] = value;
  }
  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')     // Inserta espacio antes de mayúsculas
      .replace(/^./, str => str.toUpperCase()) // Capitaliza la primera letra
      .replace(/_/g, ' ');            // Reemplaza guiones bajos por espacios
  }

  saveEdit(): void {
    this.isEditing = false;
  }
}
