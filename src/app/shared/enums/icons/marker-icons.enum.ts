export enum MarkerIconsPlace {
    Place = "0",
    Geografy = "1"
}

export enum MarkerIconsSize {
    Small = "0",
    Medium = "1",
    Big = "2"
}

export const MarkerIconsPlaceTranslate: Record<MarkerIconsPlace, string> = {
    [MarkerIconsPlace.Place]: "Lugar",
    [MarkerIconsPlace.Geografy]: "Geografía"
};