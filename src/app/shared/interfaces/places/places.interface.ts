import { MarkerIconsSize } from "../../enums/icons/marker-icons.enum";
import { PlacesTypes } from "../../enums/places/places.enums";

export interface CreatePlacesDTO {
    name: string;
    type: PlacesTypes;
    description: string;
    x: number;
    y: number;
    file?: File;
    iconSize: string;
}

export interface PlaceMarker {
    y: number;
    x: number;
    size: MarkerIconsSize;
    icon: string;
}

export interface SavePlaceMarket {
    type: string;
    x: number;
    y: number;
    name: string;
    iconSize: string;
}