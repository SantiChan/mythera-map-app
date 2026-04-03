import { Npc } from './npc.model';

export interface Faction {
    _id?: string;
    imageUrl?: string;
    name: string;
    type?: string;
    placesIds?: any[];
    descriptionHtml?: string;
    ranks?: { title: string, description: string }[];
    factionTraits?: { title: string, description: string }[];
    troops?: { name: string, quantity: number }[];
    npcIds?: Npc[];
}
