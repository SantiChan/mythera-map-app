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
    latitude: number;
    longitude: number;
    name: string;
    iconName: string;
    iconSize: string;
}