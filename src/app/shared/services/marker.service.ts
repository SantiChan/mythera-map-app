import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MarkerIconInterface } from '../interfaces/icons/marker-icon.interface';
import { SavePlaceMarket } from '../interfaces/places/places.interface';

@Injectable({
  providedIn: 'root' 
})
export class MarkerService {
  private selectedMarkerSubject = new BehaviorSubject<MarkerIconInterface | null>(null);
  selectedMarker$ = this.selectedMarkerSubject.asObservable(); 
  private saveMarkerSubject = new BehaviorSubject<SavePlaceMarket | null>(null);
  saveMarker$ = this.saveMarkerSubject.asObservable(); 

  setSelectedMarker(marker: MarkerIconInterface) {
    this.selectedMarkerSubject.next(marker);
  }

  clearSelectedMarker() {
    this.selectedMarkerSubject.next(null);
  }

  setSaveMarker(marker: SavePlaceMarket) {
    this.saveMarkerSubject.next(marker);
  }

  clearSaveMarker() {
    this.saveMarkerSubject.next(null);
  }
}