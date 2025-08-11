export enum MarkerIconsPlace {
    Place = "0",
    City = "1",
    Region = "2",
    Continent = "3",
}

export enum MarkerIconsSize {
    Small = "0",
    Medium = "1",
    Big = "2"
}

export const MarkerIconsPlaceTranslate: Record<MarkerIconsPlace, string> = {
    [MarkerIconsPlace.Place]: "Lugar",
    [MarkerIconsPlace.City]: "Ciudad",
    [MarkerIconsPlace.Region]: "Región",
    [MarkerIconsPlace.Continent]: "Continente"
};