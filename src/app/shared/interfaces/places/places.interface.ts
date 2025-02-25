export interface CreatePlacesDTO {
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    file?: File;
}