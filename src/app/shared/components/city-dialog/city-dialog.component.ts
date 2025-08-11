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
import { Router, RouterModule } from '@angular/router';
import { PlacesTypes } from '../../enums/places/places.enums';

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
    RouterModule
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router

  ) {
    this.placeForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    if (this.data && this.data.placeData && this.data.viewMode) {
      this.imagePreview = this.data.placeData.imageUrl;
    }
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
      type: PlacesTypes.City,
      description: this.placeForm.value.description,
      x: this.data.x, 
      y: this.data.y,
      iconSize: this.data.icon.size,
      file: this.selectedFile,
    };

    this._placeService.createPlace(placeData).subscribe({
      next: (response) => {
        const marker: SavePlaceMarket = {
          type: placeData.type,
          x: placeData.x,
          y: placeData.y,
          name: placeData.name,
          iconSize: placeData.iconSize
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

  goToDetails() {
    this.dialogRef.close(); 
    this._router.navigate(['/place-details', this.data.placeData._id]); 
  }
}
