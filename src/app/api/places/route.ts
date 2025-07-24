import { NextRequest, NextResponse } from "next/server";

// Tipos para a resposta da API do Geoapify
interface GeoapifyPlace {
  properties: {
    name: string;
    formatted: string;
    categories: string[];
    details?: string[];
    website?: string;
    phone?: string;
    opening_hours?: string;
    datasource: {
      sourcename: string;
      raw: {
        cuisine?: string;
        amenity?: string;
        tourism?: string;
        shop?: string;
        leisure?: string;
      };
    };
  };
  geometry: {
    coordinates: [number, number];
  };
}

interface GeoapifyResponse {
  features: GeoapifyPlace[];
  query: {
    text: string;
    parsed: {
      city: string;
      country: string;
    };
  };
}

// Mapeamento dos interesses para categorias da API Geoapify (CATEGORIAS VÁLIDAS)
const INTEREST_TO_CATEGORIES = {
  "Cultura e História": [
    "entertainment.museum",
    "entertainment.culture.gallery",
    "entertainment.culture.theatre",
    "entertainment.culture.arts_centre",
    "tourism.sights.castle",
    "tourism.sights.archaeological_site",
    "tourism.sights.memorial.monument",
    "heritage.unesco",
  ],
  "Natureza e Aventura": [
    "leisure.park",
    "leisure.park.nature_reserve",
    "leisure.park.garden",
    "natural.water",
    "natural.mountain.peak",
    "natural.forest",
    "tourism.attraction.viewpoint",
  ],
  Gastronomia: [
    "catering.restaurant",
    "catering.fast_food",
    "catering.cafe",
    "catering.bar",
    "catering.pub",
    "catering.restaurant.pizza",
    "catering.restaurant.italian",
    "catering.restaurant.chinese",
  ],
  "Vida Noturna": [
    "catering.bar",
    "catering.pub",
    "adult.nightclub",
    "adult.casino",
    "catering.biergarten",
  ],
  Compras: [
    "commercial.shopping_mall",
    "commercial.marketplace",
    "commercial.department_store",
    "commercial.supermarket",
  ],
  "Relaxamento/Bem-estar": [
    "leisure.spa",
    "service.beauty.spa",
    "service.beauty.massage",
    "sport.fitness.fitness_centre",
  ],
  Família: [
    "entertainment.zoo",
    "entertainment.aquarium",
    "entertainment.theme_park",
    "entertainment.water_park",
    "leisure.playground",
  ],
  Esportes: [
    "sport.stadium",
    "sport.sports_centre",
    "sport.swimming_pool",
    "sport.fitness.fitness_centre",
  ],
  "Arte e Museus": [
    "entertainment.museum",
    "entertainment.culture.gallery",
    "entertainment.culture.arts_centre",
    "entertainment.culture.theatre",
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination");
    const interests = searchParams.get("interests")?.split(",") || [];
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log("🏛️ API Places chamada:");
    console.log("- Destino:", destination);
    console.log("- Interesses:", interests);
    console.log("- Limite:", limit);

    if (!destination) {
      return NextResponse.json(
        { error: "Destino é obrigatório" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.log("❌ Chave da API Geoapify não configurada");
      return NextResponse.json(
        { error: "Chave da API Geoapify não configurada" },
        { status: 500 }
      );
    }

    console.log("✅ Chave da API encontrada");

    // Primeiro, obter coordenadas da cidade usando geocoding
    console.log("📍 Obtendo coordenadas da cidade...");
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search`;
    const geocodeParams = new URLSearchParams({
      text: destination,
      limit: "1",
      apiKey: apiKey,
      format: "geojson",
    });

    const geocodeResponse = await fetch(
      `${geocodeUrl}?${geocodeParams.toString()}`
    );

    if (!geocodeResponse.ok) {
      const errorText = await geocodeResponse.text();
      console.error("❌ Erro no geocoding:", geocodeResponse.status, errorText);
      return NextResponse.json(
        {
          error: `Erro ao encontrar coordenadas da cidade: ${geocodeResponse.status}`,
          details: errorText,
        },
        { status: geocodeResponse.status }
      );
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.features || geocodeData.features.length === 0) {
      console.error("❌ Cidade não encontrada:", destination);
      return NextResponse.json(
        {
          error: "Cidade não encontrada",
          details: `Não foi possível encontrar coordenadas para: ${destination}`,
        },
        { status: 404 }
      );
    }

    const [lon, lat] = geocodeData.features[0].geometry.coordinates;
    console.log(`📍 Coordenadas encontradas: ${lat}, ${lon}`);

    // Determinar categorias baseadas nos interesses
    const categories = new Set<string>();

    interests.forEach((interest) => {
      const interestCategories =
        INTEREST_TO_CATEGORIES[interest as keyof typeof INTEREST_TO_CATEGORIES];
      if (interestCategories) {
        interestCategories.forEach((cat) => categories.add(cat));
      }
    });

    // Se não houver interesses específicos, usar categorias gerais
    if (categories.size === 0) {
      [
        "catering.restaurant",
        "entertainment.museum",
        "leisure.park",
        "commercial.shopping_mall",
        "tourism.sights.castle",
        "entertainment.culture.gallery",
      ].forEach((cat) => categories.add(cat));
    }

    const categoriesString = Array.from(categories).join(",");
    console.log("📋 Categorias para buscar:", categoriesString);

    // Fazer requisição para a API do Geoapify usando coordenadas
    const url = `https://api.geoapify.com/v2/places`;
    const params = new URLSearchParams({
      categories: categoriesString,
      filter: `circle:${lon},${lat},5000`, // 5km radius from city center
      limit: limit.toString(),
      apiKey: apiKey,
      format: "geojson",
    });

    const fullUrl = `${url}?${params.toString()}`;
    console.log("🔗 URL da requisição:", fullUrl);

    const response = await fetch(fullUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro da API Geoapify:", response.status, errorText);
      return NextResponse.json(
        {
          error: `Erro da API Geoapify: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data: GeoapifyResponse = await response.json();
    console.log("📦 Dados recebidos:", data.features?.length || 0, "lugares");

    // Processar e categorizar os resultados
    const processedPlaces = data.features.map((place) => ({
      name: place.properties.name || "Nome não disponível",
      address: place.properties.formatted,
      categories: place.properties.categories,
      website: place.properties.website,
      phone: place.properties.phone,
      openingHours: place.properties.opening_hours,
      coordinates: place.geometry.coordinates,
      cuisine: place.properties.datasource?.raw?.cuisine,
      type:
        place.properties.datasource?.raw?.amenity ||
        place.properties.datasource?.raw?.tourism ||
        place.properties.datasource?.raw?.leisure ||
        "place",
    }));

    console.log("🔧 Lugares processados:", processedPlaces.length);

    // Organizar por categorias para facilitar o uso no roteiro
    const categorizedPlaces = {
      restaurants: processedPlaces.filter((place) =>
        place.categories.some(
          (cat) =>
            cat.includes("catering.restaurant") ||
            cat.includes("catering.fast_food") ||
            cat.includes("catering.cafe")
        )
      ),
      attractions: processedPlaces.filter((place) =>
        place.categories.some(
          (cat) =>
            cat.includes("tourism.sights") ||
            cat.includes("tourism.attraction") ||
            cat.includes("heritage")
        )
      ),
      culture: processedPlaces.filter((place) =>
        place.categories.some(
          (cat) =>
            cat.includes("entertainment.museum") ||
            cat.includes("entertainment.culture") ||
            cat.includes("tourism.sights")
        )
      ),
      nature: processedPlaces.filter((place) =>
        place.categories.some(
          (cat) => cat.includes("natural") || cat.includes("leisure.park")
        )
      ),
      nightlife: processedPlaces.filter((place) =>
        place.categories.some(
          (cat) =>
            cat.includes("catering.bar") ||
            cat.includes("catering.pub") ||
            cat.includes("adult.nightclub")
        )
      ),
      shopping: processedPlaces.filter((place) =>
        place.categories.some((cat) => cat.includes("commercial"))
      ),
      wellness: processedPlaces.filter((place) =>
        place.categories.some(
          (cat) => cat.includes("leisure.spa") || cat.includes("service.beauty")
        )
      ),
      sports: processedPlaces.filter((place) =>
        place.categories.some((cat) => cat.includes("sport"))
      ),
      family: processedPlaces.filter((place) =>
        place.categories.some(
          (cat) =>
            cat.includes("entertainment.zoo") ||
            cat.includes("entertainment.theme_park") ||
            cat.includes("leisure.playground")
        )
      ),
    };

    console.log("📊 Categorização dos lugares:");
    console.log("- Restaurantes:", categorizedPlaces.restaurants.length);
    console.log("- Atrações:", categorizedPlaces.attractions.length);
    console.log("- Cultura:", categorizedPlaces.culture.length);
    console.log("- Vida noturna:", categorizedPlaces.nightlife.length);
    console.log("- Compras:", categorizedPlaces.shopping.length);
    console.log("- Natureza:", categorizedPlaces.nature.length);

    const result = {
      destination,
      interests,
      coordinates: { lat, lon },
      totalPlaces: processedPlaces.length,
      places: processedPlaces,
      categorized: categorizedPlaces,
      query: geocodeData.features[0].properties,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Erro na API de lugares:", error);
    return NextResponse.json(
      {
        error: "Erro ao buscar lugares",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
