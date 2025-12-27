import { MarkerIconsPlace, MarkerIconsSize } from "../../enums/icons/marker-icons.enum";

export interface Place {
    type: MarkerIconsPlace,
    x:number;
    y: number;
    name: string;
    iconSize?: MarkerIconsSize;
}

export interface CreatePlacesDTO extends Place {
    id?: string;
    description: string;
    file?: File;
}
