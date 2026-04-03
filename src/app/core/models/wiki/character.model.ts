export interface Character {
    _id?: string;
    characterName: string;
    playerName: string;
    subraceId?: string;
    currentPlaceId?: string;
    deitiesIds?: string[];
    backstory?: string;
    eventsAndAchievements?: string[];
    plotItems?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
