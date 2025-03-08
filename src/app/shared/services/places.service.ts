import { Injectable } from "@angular/core";
import { CreatePlacesDTO } from "../interfaces/places/places.interface";
import { ApiService } from "../api/api.service";
import { API_CALLS } from "../api/api.constants";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PlaceService {

    constructor(
        private _apiService: ApiService
    ) {}

    createPlace(newPlaceRequest: CreatePlacesDTO): Observable<any> {
        const formData = this._convertFDCreatePlaceDTO(newPlaceRequest);

        return this._apiService.post(API_CALLS.place, formData);
    }

    private _convertFDCreatePlaceDTO(placeData: CreatePlacesDTO): FormData {
        const formData = new FormData();
        formData.append('name', placeData.name);
        formData.append('description', placeData.description);
        formData.append('latitude', placeData.latitude.toString());
        formData.append('longitude', placeData.longitude.toString());
        formData.append('iconName', placeData.icon.name);
        formData.append('iconSize', placeData.icon.size.toString());
    
        if (placeData.file) {
          formData.append('file', placeData.file);
        }
    
        return formData;
    }
}