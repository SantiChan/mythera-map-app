import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaceService } from '../../services/places.service';
import { CreatePlacesDTO, SavePlaceMarket } from '../../interfaces/places/places.interface';
import { CommonModule } from '@angular/common';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'app-city-dialog',
  standalone: true,
  templateUrl: './city-dialog.component.html',
  styleUrls: ['./city-dialog.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  providers: [PlaceService]
})
export class CityDialogComponent {
  placeForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private _fb: FormBuilder,
    private _placeService: PlaceService,
    private _markerService: MarkerService,
    public dialogRef: MatDialogRef<CityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    this.placeForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
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

  onSave() {
    if (this.placeForm.invalid || !this.selectedFile) {
      console.error('Error en el formulario:');
      return; 
    }

    const placeData: CreatePlacesDTO = {
      name: this.placeForm.value.name,
      description: this.placeForm.value.description,
      latitude: this.data.lat, 
      longitude: this.data.lng,
      icon: {
        name: this.data.icon.name,
        size: this.data.icon.size
      },
      file: this.selectedFile,
    };

    this._placeService.createPlace(placeData).subscribe({
      next: (response) => {
        const marker: SavePlaceMarket = {
          marker: this.data.marker,
          lat: this.data.lat,
          lng: this.data.lng          
        };

        this._markerService.setSaveMarker(marker);
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error al guardar el lugar', error);
      }
    });
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
