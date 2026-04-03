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

    getPlaceDetails(id: string): Observable<any> {
        return this._apiService.get(`${API_CALLS.place}/details/${id}`);
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

    updatePlaceImage(id: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this._apiService.patch(`${API_CALLS.place}/${id}/image`, formData);
    }

    updateDescription(placeId: string, descriptionHtml: string): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/description`, { descriptionHtml });
    }

    updateCreatures(placeId: string, data: { creatures?: string; legendaryCreatures?: string }): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/creatures`, data);
    }

    deletePlace(id: string): Observable<any> {
        return this._apiService.delete(`${API_CALLS.place}/${id}`);
    }

    addPlaceOfInterest(placeId: string, data: { name: string; description: string }): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/places-of-interest`, data);
    }

    updatePlaceOfInterest(placeId: string, placeOfInterestId: string, data: { name: string; description: string }): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/places-of-interest/${placeOfInterestId}`, data);
    }

    deletePlaceOfInterest(placeId: string, placeOfInterestId: string): Observable<any> {
        return this._apiService.delete(`${API_CALLS.place}/${placeId}/places-of-interest/${placeOfInterestId}`);
    }

    addObject(placeId: string, data: { name: string; description: string }): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/objects`, data);
    }

    updateObject(placeId: string, objectId: string, data: { name: string; description: string }): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/objects/${objectId}`, data);
    }

    deleteObject(placeId: string, objectId: string): Observable<any> {
        return this._apiService.delete(`${API_CALLS.place}/${placeId}/objects/${objectId}`);
    }

    addArmy(placeId: string, data: { name: string; description: string }): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/army`, data);
    }

    updateArmy(placeId: string, armyId: string, data: { name: string; description: string }): Observable<any> {
        return this._apiService.patch(`${API_CALLS.place}/${placeId}/army/${armyId}`, data);
    }

    deleteArmy(placeId: string, armyId: string): Observable<any> {
        return this._apiService.delete(`${API_CALLS.place}/${placeId}/army/${armyId}`);
    }

    addNpc(placeId: string, npcData: any, file?: File): Observable<any> {
        const formData = new FormData();
        
        if (npcData.id) formData.append('id', npcData.id);
        if (npcData.name) formData.append('name', npcData.name);
        if (npcData.title) formData.append('title', npcData.title);
        if (npcData.descriptionHtml) formData.append('descriptionHtml', npcData.descriptionHtml);
        if (npcData.personality) formData.append('personality', npcData.personality);
        if (npcData.imageUrl) formData.append('imageUrl', npcData.imageUrl);
        if (file) formData.append('file', file);

        return this._apiService.patch(`${API_CALLS.place}/${placeId}/npcs`, formData);
    }

    updateNpc(placeId: string, npcId: string, npcData: any, file?: File): Observable<any> {
        const formData = new FormData();
        
        if (npcData.id) formData.append('id', npcData.id);
        if (npcData.name) formData.append('name', npcData.name);
        if (npcData.title) formData.append('title', npcData.title);
        if (npcData.descriptionHtml) formData.append('descriptionHtml', npcData.descriptionHtml);
        if (npcData.personality) formData.append('personality', npcData.personality);
        if (npcData.imageUrl) formData.append('imageUrl', npcData.imageUrl);
        if (file) formData.append('file', file);

        return this._apiService.patch(`${API_CALLS.place}/${placeId}/npcs/${npcId}`, formData);
    }

    deleteNpc(placeId: string, npcId: string): Observable<any> {
        return this._apiService.delete(`${API_CALLS.place}/${placeId}/npcs/${npcId}`);
    }
}