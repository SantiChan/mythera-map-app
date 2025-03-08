import { MarkerIconsSize } from "../../enums/icons/marker-icons.enum";

export interface CreatePlacesDTO {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    file?: File;
    icon: PlaceIconDTO;
}

export interface PlaceIconDTO {
    size: string;
    name: string;
}

export interface PlaceMarker { 
    lng: number; 
    lat: number; 
    size: MarkerIconsSize; 
    icon: string;
}

export interface SavePlaceMarket {
    marker: HTMLImageElement,
    lng: number; 
    lat: number;
}