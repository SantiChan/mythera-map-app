import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MarkerIconInterface } from '../interfaces/icons/marker-icon.interface';
import { CreatePlacesDTO } from '../interfaces/places/places.interface';

@Injectable({
  providedIn: 'root' 
})
export class MarkerService {
  private selectedMarkerSubject = new BehaviorSubject<MarkerIconInterface | null>(null);
  private saveMarkerSubject = new BehaviorSubject<CreatePlacesDTO | null>(null);
  private reloadMarkersSubject = new Subject<boolean>();

  selectedMarker$ = this.selectedMarkerSubject.asObservable(); 
  saveMarker$ = this.saveMarkerSubject.asObservable();
  reloadMarkers$ = this.reloadMarkersSubject.asObservable();

  setSelectedMarker(marker: MarkerIconInterface) {
    this.selectedMarkerSubject.next(marker);
  }

  clearSelectedMarker() {
    this.selectedMarkerSubject.next(null);
  }

  setSaveMarker(marker: CreatePlacesDTO) {
    this.saveMarkerSubject.next(marker);
  }

  clearSaveMarker() {
    this.saveMarkerSubject.next(null);
  }

  reloadMarkers() {
    console.log("service reload")
    this.reloadMarkersSubject.next(true);
  }
}