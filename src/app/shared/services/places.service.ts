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

    private _convertFDCreatePlaceDTO(placeData: CreatePlacesDTO): FormData {
        const formData = new FormData();
        formData.append('name', placeData.name);
        formData.append('type', placeData.type);
        formData.append('description', placeData.description);
        formData.append('x', placeData.x.toString());
        formData.append('y', placeData.y.toString());

        if (placeData.iconSize) {
            formData.append('iconSize', placeData.iconSize.toString());
        }

        if (placeData.file) {
          formData.append('file', placeData.file);
        }
    
        return formData;
    }

    private _convertFDUpdatePlaceDTO(dto: CreatePlacesDTO & { file?: File | null }): FormData {
        const fd = new FormData();
        if (dto.name != null) fd.append('name', dto.name);
        if (dto.type != null) fd.append('type', dto.type);
        if (dto.description != null) fd.append('description', dto.description);
        if (dto.x != null) fd.append('x', String(dto.x));
        if (dto.y != null) fd.append('y', String(dto.y));
        if (dto.iconSize != null) fd.append('iconSize', String(dto.iconSize));
        if (dto.file) fd.append('file', dto.file);
        return fd;
    }

    createPlace(newPlaceRequest: CreatePlacesDTO): Observable<any> {
        const formData = this._convertFDCreatePlaceDTO(newPlaceRequest);

        return this._apiService.post(API_CALLS.place, formData);
    }

    getPlaces(): Observable<any> {
        return this._apiService.get(API_CALLS.place);

    }

    updatePlace(id: string, data: CreatePlacesDTO, file?: File): Observable<any> {
        let finalData: CreatePlacesDTO = data;

        if (file) {
            finalData = {
                ...finalData,
                file: file
            }
        }

        const formData = this._convertFDUpdatePlaceDTO(finalData);

        return this._apiService.patch(`${API_CALLS.place}/${id}`, formData);
    }

    deletePlace(id: string): Observable<any> {
        return this._apiService.delete(`${API_CALLS.place}/${id}`);
    }
}