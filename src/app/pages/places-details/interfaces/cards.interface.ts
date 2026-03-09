import { Npc } from "../../../shared/interfaces/places/npc.interface";

export interface NamedItem {
  name: string;
  description: string;
};

export interface DescriptionCard {
  type: 'description';
  title: string;
  image: string;
  descriptionHtml: string;
};

export interface CreaturesCard {
  type: 'creatures';
  title: string;
  image: string;
  creatures: string;
  legendaryCreatures: string;
  objects: NamedItem[];
  army: NamedItem[];
};

export interface PlacesOfInterestCard {
  type: 'places';
  title: string;
  image: string;
  placesOfInterest: NamedItem[];
};

export interface NpcsCard {
  type: 'npcs';
  title: string;
  image: string;
  npcs: Npc[];
};

export interface NpcEditCardData {
  newNpc: boolean;
  npc: Npc;
}

export type Card = DescriptionCard | CreaturesCard | PlacesOfInterestCard | NpcsCard;
