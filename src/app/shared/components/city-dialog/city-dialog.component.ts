import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaceService } from '../../services/places.service';
import { CreatePlacesDTO, Place } from '../../interfaces/places/places.interface';
import { CommonModule } from '@angular/common';
import { MarkerService } from '../../services/marker.service';
import { Router, RouterModule } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { MatIconModule } from '@angular/material/icon';

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
    RouterModule,
    MatIconModule
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
    private _router: Router,
    private _snackbar: SnackbarService

  ) {
    this.placeForm = this._fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    console.log("this.data", this.data, this.data.viewMode)
    if (this.data && this.data.placeData && this.data.viewMode) {
      this.imagePreview = this.data.placeData.imageUrl;

      this.placeForm.setValue({ name: this.data.placeData.name, description: this.data.placeData.description });
    }
  }

  private _createPlace(placeData: CreatePlacesDTO): void {
    if (this.selectedFile) {
      placeData = {
        ...placeData,
        file: this.selectedFile
      };
    }

    this._placeService.createPlace(placeData).subscribe({
      next: (response) => {
        const marker: CreatePlacesDTO = {
          type: placeData.type,
          x: placeData.x,
          y: placeData.y,
          name: placeData.name,
          iconSize: placeData.iconSize,
          description: placeData.description
        };

        this._markerService.setSaveMarker(marker);

        this._snackbar.success('Guardado correctamente'),
        this.dialogRef.close();
      },
      error: (error) => {
        this._snackbar.error('Error guardando'),
        console.error('Error al guardar el lugar', error);
      }
    });
  }

  private _updatePlace(placeData: CreatePlacesDTO): void {
    //No image modified
    if (!this.selectedFile) {
      this._placeService.updatePlace(this.data.placeData._id, placeData).subscribe({
        next: (resp) => {
          this._markerService.setSaveMarker({
            ...placeData,
            type: placeData.type!,
            x: placeData.x!,
            y: placeData.y!,
            iconSize: placeData.iconSize!,
            name: placeData.name!,
            description: placeData.description!
          });

          this._markerService.reloadMarkers();
      
          this._snackbar.success('Actualizado correctamente');
          this.dialogRef.close();
        },
        error: (err) => {
          this._snackbar.error('Error actualizando');
          console.error(err);
        }
      });
      return;
    }

    //If we have image edited
    this._placeService.updatePlace(this.data.placeData._id, placeData, this.selectedFile).subscribe({
      next: (resp) => {
        this._markerService.setSaveMarker({
          ...placeData,
          type: placeData.type!,
          x: placeData.x!,
          y: placeData.y!,
          iconSize: placeData.iconSize!,
          name: placeData.name!,
          description: placeData.description!
        });
        this._snackbar.success('Actualizado correctamente');
        this.dialogRef.close(resp);
      },
      error: (err) => {
        this._snackbar.error('Error actualizando');
        console.error(err);
      }
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

  onSubmit() {
    if (this.placeForm.invalid) {
      console.error('Error en el formulario:', this.placeForm, this.selectedFile);
      return; 
    }

    const placeData: CreatePlacesDTO = {
      name: this.placeForm.value.name,
      type: this.data.placeData.type,
      description: this.placeForm.value.description,
      x: this.data.placeData.x, 
      y: this.data.placeData.y,
      iconSize: this.data.placeData.icon ? this.data.placeData.icon.size : null,
    };

    if (!this.data.editMode) {
      this._createPlace(placeData);
    } else {
      this._updatePlace(placeData);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  goToDetails() {
    this.dialogRef.close(); 
    this._router.navigate(['/place-details', this.data.placeData._id]); 
  }

  onDelete() {
    const ok = confirm('¿Seguro que quieres borrar este lugar?');
    if (!ok) return;

    this._placeService.deletePlace(this.data.placeData._id).subscribe({
      next: (resp) => {
        this._snackbar.success('Eliminado correctamente');
        this.dialogRef.close(resp);
      },
      error: (err) => {
        this._snackbar.error('Error eliminando');
        console.error(err);
      }
    });
  }

  onEdit(): void {
    this.data.viewMode = false;
    this.data.editMode = true;
  }
}
