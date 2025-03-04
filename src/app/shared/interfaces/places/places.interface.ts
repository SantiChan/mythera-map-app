export interface CreatePlacesDTO {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    file?: File;
    icon?: PlaceIconDTO;
}

export interface PlaceIconDTO {
    size: string;
    name: string;
}