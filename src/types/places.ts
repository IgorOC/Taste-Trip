export interface Place {
  name: string;
  address: string;
  categories: string[];
  website?: string;
  phone?: string;
  openingHours?: string;
  coordinates: [number, number];
  cuisine?: string;
  type: string;
}

export interface CategorizedPlaces {
  restaurants: Place[];
  attractions: Place[];
  culture: Place[];
  nature: Place[];
  nightlife: Place[];
  shopping: Place[];
  wellness: Place[];
  sports: Place[];
  family: Place[];
}

export interface PlacesApiResponse {
  destination: string;
  interests: string[];
  totalPlaces: number;
  places: Place[];
  categorized: CategorizedPlaces;
  query?: {
    text: string;
    parsed: {
      city: string;
      country: string;
    };
  };
}

export type InterestCategory =
  | "Cultura e História"
  | "Natureza e Aventura"
  | "Gastronomia"
  | "Vida Noturna"
  | "Compras"
  | "Relaxamento/Bem-estar"
  | "Família"
  | "Esportes"
  | "Arte e Museus";
