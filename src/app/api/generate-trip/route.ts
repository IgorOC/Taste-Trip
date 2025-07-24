/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { getDaysCount, getBudgetCategory } from "@/lib/utils";
import { cookies } from "next/headers";

// Tipos para dados do clima
type WeatherDay = {
  dayName: string;
  temperature: number;
};

type WeatherData = {
  current: {
    description: string;
    temperature: number;
  };
  tripForecast: WeatherDay[];
};

// Tipos para lugares
interface Place {
  name: string;
  cuisine?: string;
  address: string;
}

interface PlacesData {
  totalPlaces: number;
  categorized: {
    restaurants: Place[];
    attractions: Place[];
    culture: Place[];
    nightlife: Place[];
    shopping: Place[];
    nature: Place[];
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função para extrair nomes dos lugares para validação
function extractPlaceNames(placesData: PlacesData): string[] {
  const placeNames: string[] = [];

  if (placesData && placesData.categorized) {
    // Extrair nomes dos restaurantes
    if (placesData.categorized.restaurants) {
      placeNames.push(
        ...placesData.categorized.restaurants.map((place) => place.name)
      );
    }

    // Extrair nomes das atrações
    if (placesData.categorized.attractions) {
      placeNames.push(
        ...placesData.categorized.attractions.map((place) => place.name)
      );
    }

    // Extrair nomes dos locais culturais
    if (placesData.categorized.culture) {
      placeNames.push(
        ...placesData.categorized.culture.map((place) => place.name)
      );
    }

    // Extrair nomes da vida noturna
    if (placesData.categorized.nightlife) {
      placeNames.push(
        ...placesData.categorized.nightlife.map((place) => place.name)
      );
    }

    // Extrair nomes de natureza
    if (placesData.categorized.nature) {
      placeNames.push(
        ...placesData.categorized.nature.map((place) => place.name)
      );
    }
  }

  return placeNames;
}

// Função de validação melhorada
function validatePlacesUsage(
  itinerary: any,
  expectedPlaces: string[]
): boolean {
  if (!expectedPlaces || expectedPlaces.length === 0) return true;

  let placesFound = 0;
  const usedPlaces: string[] = [];

  itinerary.days?.forEach((day: any) => {
    // Verificar lunch.description
    if (day.lunch?.description) {
      expectedPlaces.forEach((place) => {
        if (day.lunch.description.toLowerCase().includes(place.toLowerCase())) {
          placesFound++;
          usedPlaces.push(place);
        }
      });
    }

    // Verificar dinner.name
    if (day.dinner?.name) {
      expectedPlaces.forEach((place) => {
        if (day.dinner.name.toLowerCase().includes(place.toLowerCase())) {
          placesFound++;
          usedPlaces.push(place);
        }
      });
    }

    // Verificar afternoon.location
    if (day.afternoon?.location) {
      expectedPlaces.forEach((place) => {
        if (
          day.afternoon.location.toLowerCase().includes(place.toLowerCase())
        ) {
          placesFound++;
          usedPlaces.push(place);
        }
      });
    }

    // Verificar morning.description
    if (day.morning?.description) {
      expectedPlaces.forEach((place) => {
        if (
          day.morning.description.toLowerCase().includes(place.toLowerCase())
        ) {
          placesFound++;
          usedPlaces.push(place);
        }
      });
    }
  });

  const usagePercentage = placesFound / expectedPlaces.length;
  console.log(
    `📊 Lugares usados: ${placesFound}/${expectedPlaces.length} (${Math.round(usagePercentage * 100)}%)`
  );
  console.log(
    `✅ Lugares encontrados no roteiro:`,
    [...new Set(usedPlaces)].slice(0, 3)
  );

  return usagePercentage >= 0.25; // Pelo menos 25% dos lugares devem ser usados
}

// Função para gerar roteiro com validação de lugares reais
async function gerarComValidacao(
  prompt: string,
  lugaresEsperados: string[],
  maxTentativas = 3
) {
  console.log(
    "🎯 Lugares esperados para validação:",
    lugaresEsperados.slice(0, 3)
  );

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    console.log(`🤖 Tentativa ${tentativa} de geração com IA...`);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.3, // Reduzir temperatura para mais consistência
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: `Você é um especialista em turismo que SEMPRE usa lugares reais fornecidos.

REGRAS OBRIGATÓRIAS:
- Use EXATAMENTE os nomes dos restaurantes e locais fornecidos na lista
- No campo "lunch.description" coloque: "Nome do Restaurante - Endereço completo"  
- No campo "dinner.name" coloque: "Nome do Restaurante - Endereço completo"
- No campo "afternoon.location" coloque: "Nome do Local - Endereço completo"
- No campo "morning.description" inclua nomes de locais quando possível
- Distribua os lugares reais ao longo dos dias do roteiro
- Para cada refeição, use um restaurante diferente da lista fornecida

EXEMPLO CORRETO:
{
  "day": 1,
  "lunch": {
    "description": "Can Pep - carrer des Rafal, 6, 07001 Palma",
    "tip": "Restaurante famoso por hambúrgueres e pizzas artesanais"
  },
  "dinner": {
    "name": "Es Baluard Restaurant - Plaça Porta de Santa Catalina, 10",
    "type": "Mediterrânea",
    "link": ""
  },
  "afternoon": {
    "activity": "Visita cultural",
    "location": "Catedral de Palma - Plaça de la Seu, s/n",
    "duration": "2 horas"
  }
}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const resposta = completion.choices[0]?.message?.content;
    if (!resposta) continue;

    let cleaned = resposta.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
    if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();

    try {
      const itinerary = JSON.parse(cleaned);

      // Usar a validação melhorada
      const isValid = validatePlacesUsage(itinerary, lugaresEsperados);

      if (isValid) {
        console.log("✅ Validação passou! Lugares reais foram usados.");
        return itinerary;
      } else {
        console.warn(
          `⚠️ Tentativa ${tentativa}: Poucos lugares reais usados. Tentando novamente...`
        );
      }
    } catch (err) {
      console.error("❌ Erro ao parsear JSON:", err);
    }
  }

  // Se chegou aqui, fazer uma última tentativa com instruções mais fortes
  console.warn("🔄 Fazendo tentativa final com instruções mais rigorosas...");

  const finalCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0.1, // Temperatura muito baixa para consistência
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content: `Você DEVE usar os lugares reais fornecidos. Esta é a última tentativa.
        
OBRIGATÓRIO: Para cada campo abaixo, use nomes de lugares reais da lista:
- lunch.description: "Nome Restaurante Real - Endereço"
- dinner.name: "Nome Restaurante Real - Endereço"  
- afternoon.location: "Nome Local Real - Endereço"`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const finalResponse = finalCompletion.choices[0]?.message?.content;
  if (!finalResponse) {
    throw new Error("Erro: Resposta vazia da OpenAI");
  }

  let cleaned = finalResponse.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  cleaned = cleaned.trim();

  return JSON.parse(cleaned);
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== 🚀 INICIO GERAÇÃO ROTEIRO ===");

    // Verificar cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Criar cliente Supabase para servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // No-op para API routes
          },
        },
      }
    );

    // Tentar obter usuário
    let authenticatedUser = null;
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    authenticatedUser = user;

    // Se não conseguir pelo método normal, tente pelo token dos cookies
    if (!authenticatedUser) {
      console.log("Tentando método alternativo de autenticação...");

      const authCookie = allCookies.find(
        (cookie) =>
          cookie.name.includes("auth-token") &&
          cookie.name.includes("shdzhrdzfszbrtdvadpk")
      );

      if (authCookie) {
        try {
          let cookieValue = decodeURIComponent(authCookie.value);

          if (cookieValue.startsWith("base64-")) {
            cookieValue = cookieValue.substring(7);
            cookieValue = atob(cookieValue);
          }

          const tokenData = JSON.parse(cookieValue);

          const serverSupabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              cookies: {
                getAll() {
                  return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                  // No-op para API routes
                },
              },
            }
          );

          const { data: sessionData, error: sessionError } =
            await serverSupabase.auth.setSession({
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
            });

          if (sessionData.user) {
            authenticatedUser = sessionData.user;
            console.log("✅ Usuário autenticado via cookie!");
          }
        } catch (parseError) {
          console.log("Erro ao processar cookie:", parseError);
        }
      }

      if (!authenticatedUser) {
        return NextResponse.json(
          { error: "Usuário não autenticado" },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const {
      origin,
      destination,
      startDate,
      endDate,
      budget,
      budget_category,
      title,
      adults,
      childrenString,
      travelStyle,
      transportPreference,
      accommodationPreference,
      dietaryRestrictions,
      accessibility,
      specialNotes,
      interests,
    } = body;

    console.log("📝 Dados recebidos:");
    console.log("- Destino:", destination);
    console.log("- Interesses:", interests);
    console.log("- Orçamento:", budget);

    if (
      !origin ||
      !destination ||
      !startDate ||
      !endDate ||
      !budget ||
      !adults
    ) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    const days = getDaysCount(startDate, endDate);
    const category = budget_category || getBudgetCategory(budget);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 🏛️ BUSCAR LUGARES COM GEOAPIFY
    console.log("🏛️ Iniciando busca por lugares...");
    console.log("- Base URL:", baseUrl);
    console.log("- Interests array:", interests);
    console.log("- Interests joined:", interests?.join(",") || "");

    const placesUrl = `${baseUrl}/api/places?destination=${encodeURIComponent(
      destination
    )}&interests=${encodeURIComponent(interests?.join(",") || "")}&limit=20`;

    console.log("🔗 URL da API places:", placesUrl);

    let placesData: PlacesData | null = null;
    let placesError = null;

    try {
      const placesResponse = await fetch(placesUrl);
      console.log("📡 Status da resposta places:", placesResponse.status);

      if (placesResponse.ok) {
        placesData = await placesResponse.json();
        console.log("✅ Places data recebida:");
        console.log("- Total lugares:", placesData?.totalPlaces || 0);

        if (placesData && placesData.categorized) {
          console.log("📊 Lugares por categoria:");
          console.log(
            "- Restaurantes:",
            placesData.categorized.restaurants?.length || 0
          );
          console.log(
            "- Atrações:",
            placesData.categorized.attractions?.length || 0
          );
          console.log(
            "- Cultura:",
            placesData.categorized.culture?.length || 0
          );
          console.log(
            "- Vida noturna:",
            placesData.categorized.nightlife?.length || 0
          );
        }
      } else {
        const errorText = await placesResponse.text();
        placesError = errorText;
        console.log(
          "❌ Erro ao buscar lugares:",
          placesResponse.status,
          errorText
        );
      }
    } catch (fetchError) {
      placesError = fetchError;
      console.log("❌ Erro na requisição places:", fetchError);
    }

    // 🌤️ BUSCAR CLIMA
    console.log("🌤️ Buscando clima...");
    const weatherResponse = await fetch(
      `${baseUrl}/api/weather?city=${encodeURIComponent(
        destination
      )}&startDate=${encodeURIComponent(
        startDate
      )}&endDate=${encodeURIComponent(endDate)}`
    );

    let weatherData: WeatherData | null = null;
    if (weatherResponse.ok) {
      weatherData = await weatherResponse.json();
      console.log("✅ Dados do clima obtidos");
    }

    // 🍽️ BUSCAR CULINÁRIA
    console.log("🍽️ Buscando culinária...");
    const cuisineResponse = await fetch(
      `${baseUrl}/api/cuisine?destination=${encodeURIComponent(destination)}`
    );

    let cuisineData = null;
    if (cuisineResponse.ok) {
      cuisineData = await cuisineResponse.json();
      console.log("✅ Dados de culinária obtidos");
    }

    // 💰 DIRETRIZES DE ORÇAMENTO
    const budgetGuidelines = {
      baixo: {
        accommodation: "hostels, pousadas simples, Airbnb econômico",
        transportation: "transporte público, caminhadas, ônibus",
        food: "comida de rua, restaurantes populares, mercados locais",
        activities: "atrações gratuitas, parques, museus gratuitos",
        dailyBudget: Math.round((budget / days) * 0.8),
      },
      medio: {
        accommodation: "hotéis 3 estrelas, pousadas confortáveis",
        transportation: "mix de transporte público e táxi/uber",
        food: "restaurantes locais, algumas experiências gastronômicas",
        activities: "mix de atrações pagas e gratuitas, tours guiados",
        dailyBudget: Math.round((budget / days) * 0.85),
      },
      alto: {
        accommodation: "hotéis 4-5 estrelas, resorts, Airbnb premium",
        transportation: "táxi, uber, transfers privados, aluguel de carro",
        food: "restaurantes renomados, experiências gastronômicas",
        activities: "tours privados, experiências exclusivas, spas",
        dailyBudget: Math.round((budget / days) * 0.9),
      },
    };

    const currentGuidelines =
      budgetGuidelines[category as keyof typeof budgetGuidelines];

    // 🌡️ INFORMAÇÕES DO CLIMA
    let weatherInfo = "";
    if (
      weatherData &&
      weatherData.tripForecast &&
      weatherData.tripForecast.length > 0
    ) {
      weatherInfo = "Previsão do tempo durante a viagem:\n";
      weatherData.tripForecast.forEach((day: WeatherDay) => {
        weatherInfo += `${day.dayName}: Média de ${day.temperature}°C\n`;
      });
    } else if (weatherData) {
      weatherInfo = `Clima atual: ${weatherData.current.description}, ${weatherData.current.temperature}°C`;
    }

    // 🏛️ INFORMAÇÕES DOS LUGARES ENCONTRADOS - FORMATO MAIS CLARO
    let placesInfo = "";
    let hasPlacesData = false;

    if (placesData && placesData.categorized) {
      hasPlacesData = true;
      placesInfo =
        "\n\n=== LUGARES REAIS ENCONTRADOS EM " +
        destination.toUpperCase() +
        " ===\n";
      placesInfo += "⚠️ USE ESTES LUGARES ESPECÍFICOS NO ROTEIRO ⚠️\n\n";

      if (
        placesData.categorized.restaurants &&
        placesData.categorized.restaurants.length > 0
      ) {
        placesInfo += "🍽️ RESTAURANTES (use para refeições):\n";
        placesData.categorized.restaurants
          .slice(0, 8)
          .forEach((place: Place, index: number) => {
            placesInfo += `${index + 1}. ${place.name}${place.cuisine ? ` (${place.cuisine})` : ""}\n`;
            placesInfo += `   📍 ${place.address}\n`;
          });
        placesInfo += "\n";
      }

      if (
        placesData.categorized.attractions &&
        placesData.categorized.attractions.length > 0
      ) {
        placesInfo += "🏛️ ATRAÇÕES TURÍSTICAS (use para atividades):\n";
        placesData.categorized.attractions
          .slice(0, 8)
          .forEach((place: Place, index: number) => {
            placesInfo += `${index + 1}. ${place.name}\n`;
            placesInfo += `   📍 ${place.address}\n`;
          });
        placesInfo += "\n";
      }

      if (
        placesData.categorized.culture &&
        placesData.categorized.culture.length > 0
      ) {
        placesInfo += "🎭 LOCAIS CULTURAIS (use para atividades culturais):\n";
        placesData.categorized.culture
          .slice(0, 6)
          .forEach((place: Place, index: number) => {
            placesInfo += `${index + 1}. ${place.name}\n`;
            placesInfo += `   📍 ${place.address}\n`;
          });
        placesInfo += "\n";
      }

      if (
        placesData.categorized.nightlife &&
        placesData.categorized.nightlife.length > 0
      ) {
        placesInfo += "🌙 VIDA NOTURNA:\n";
        placesData.categorized.nightlife
          .slice(0, 6)
          .forEach((place: Place, index: number) => {
            placesInfo += `${index + 1}. ${place.name}\n`;
            placesInfo += `   📍 ${place.address}\n`;
          });
        placesInfo += "\n";
      }

      if (
        placesData.categorized.shopping &&
        placesData.categorized.shopping.length > 0
      ) {
        placesInfo += "🛍️ COMPRAS:\n";
        placesData.categorized.shopping
          .slice(0, 4)
          .forEach((place: Place, index: number) => {
            placesInfo += `${index + 1}. ${place.name}\n`;
            placesInfo += `   📍 ${place.address}\n`;
          });
        placesInfo += "\n";
      }

      if (
        placesData.categorized.nature &&
        placesData.categorized.nature.length > 0
      ) {
        placesInfo += "🌿 NATUREZA E PARQUES:\n";
        placesData.categorized.nature
          .slice(0, 4)
          .forEach((place: Place, index: number) => {
            placesInfo += `${index + 1}. ${place.name}\n`;
            placesInfo += `   📍 ${place.address}\n`;
          });
      }

      placesInfo +=
        "\n⚠️ IMPORTANTE: Inclua estes lugares no roteiro com seus nomes e endereços exatos!\n";
    } else {
      console.log(
        "⚠️ Nenhum lugar específico encontrado, usando dados genéricos"
      );
      if (placesError) {
        console.log("Erro ao buscar places:", placesError);
      }
    }

    console.log("📝 Places info gerada:", placesInfo.substring(0, 200) + "...");
    console.log("🎯 Has places data:", hasPlacesData);

    // Extrair lista de nomes dos lugares para validação
    let expectedPlaces: string[] = [];
    if (hasPlacesData && placesData) {
      expectedPlaces = extractPlaceNames(placesData);
      console.log(
        "📋 Lugares esperados extraídos:",
        expectedPlaces.slice(0, 5)
      );
    }

    // 🤖 PROMPT PARA IA - VERSÃO ATUALIZADA
    const prompt = `
Crie um roteiro de viagem para ${destination}, saindo de ${origin}, com duração de ${days} dias (de ${startDate} a ${endDate}), orçamento total de R${budget} (${category}).

INFORMAÇÕES DA VIAGEM:
- Título: ${title || "Roteiro Personalizado"}
- Viajantes: ${adults} adulto(s) ${childrenString ? `e ${childrenString}` : ""}
- Estilo: ${travelStyle || "não informado"}
- Transporte: ${transportPreference || "não informado"}
- Hospedagem: ${accommodationPreference || "não informada"}
- Restrições: ${dietaryRestrictions || "nenhuma"}
- Acessibilidade: ${accessibility || "nenhuma"}
- Interesses: ${interests?.join(", ") || "não informados"}
- Observações: ${specialNotes || "nenhuma"}
- Clima: ${weatherInfo}

${placesInfo}

${
  hasPlacesData
    ? `
🎯 IMPORTANTE: Foram encontrados lugares específicos em ${destination}. 
VOCÊ DEVE incluir estes lugares reais no roteiro:

✅ PARA REFEIÇÕES (almoço/jantar): Use os restaurantes da lista "RESTAURANTES"
✅ PARA ATIVIDADES CULTURAIS: Use os locais da lista "LOCAIS CULTURAIS" 
✅ PARA ATRAÇÕES: Use os da lista "ATRAÇÕES TURÍSTICAS"
✅ SEMPRE mencione o nome completo e endereço dos lugares

EXEMPLO DE COMO USAR OS LUGARES:
- Para almoço: "Can Pep - carrer des Rafal, 6"
- Para jantar: "Restaurante Es Baluard - Plaça Porta de Santa Catalina"
- Para atividades: "Catedral de Palma - Plaça de la Seu"

Distribua estes lugares ao longo dos ${days} dias do roteiro.
`
    : `
Use seu conhecimento geral sobre ${destination} para sugerir lugares adequados ao orçamento ${category}.
`
}

- Orçamento diário estimado: R$ ${currentGuidelines.dailyBudget}
- Adapte ao estilo de viagem: ${travelStyle || "equilibrado"}
- Considere os interesses: ${interests?.join(", ") || "gerais"}

ESTRUTURA JSON OBRIGATÓRIA (responda apenas com JSON válido, sem comentários):
{
  "overview": {
    "title": "Roteiro para ${destination}",
    "introduction": "Descrição da viagem e experiências que aguardam"
  },
  "days": [
    {
      "day": 1,
      "title": "Nome do dia baseado nas atividades",
      "morning": {
        "description": "Atividades da manhã com locais específicos mencionados",
        "tip": "Dica útil para a manhã"
      },
      "lunch": {
        "description": "Nome e endereço específico do restaurante para almoço (use lugares reais da lista)",
        "tip": "Dica sobre o restaurante ou culinária"
      },
      "afternoon": {
        "activity": "Atividade da tarde com locais específicos",
        "location": "Nome e endereço específico do local (use lugares reais da lista)",
        "duration": "2-3 horas",
        "tip": "Dica para a atividade"
      },
      "dinner": {
        "name": "Nome e endereço específico do restaurante para jantar (use lugares reais da lista)",
        "type": "Tipo de culinária",
        "link": ""
      },
      "night_activity": "Atividade noturna opcional"
    }
  ],
  "final_tips": {
    "transportation": "Dicas de transporte",
    "weather": "Dicas sobre clima e vestuário",
    "tipping": "Informações sobre gorjetas",
    "safety": "Dicas de segurança",
    "local_culture": "Informações culturais importantes",
    "shopping": "Dicas de compras e souvenirs"
  }
}

REGRAS CRÍTICAS:
1. Use EXATAMENTE os nomes dos restaurantes e locais da lista fornecida
2. No campo "location" e nos restaurantes, inclua nome + endereço completo
3. Para cada refeição (almoço/jantar), escolha um restaurante diferente da lista
4. Distribua os lugares reais ao longo dos ${days} dias
5. Se não há lugar específico para algo, use conhecimento geral, mas priorize os lugares reais
`;

    console.log("🤖 Enviando prompt para IA...");
    console.log("📝 Tamanho do prompt:", prompt.length, "caracteres");

    // Usar a função de validação melhorada
    let itineraryData;
    try {
      itineraryData = await gerarComValidacao(prompt, expectedPlaces, 3);
      console.log("✅ Roteiro gerado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao gerar roteiro:", error);
      throw new Error("Erro ao gerar roteiro com IA");
    }

    // 🔍 DEBUG - Verificar roteiro gerado
    console.log("🔍 DEBUG - Verificando roteiro gerado:");
    itineraryData.days?.forEach((day: any, index: number) => {
      console.log(`Dia ${index + 1}:`);
      console.log(`  - Almoço: ${day.lunch?.description || "Não informado"}`);
      console.log(`  - Jantar: ${day.dinner?.name || "Não informado"}`);
      console.log(
        `  - Local tarde: ${day.afternoon?.location || "Não informado"}`
      );
    });

    // 💾 SALVAR NO BANCO
    console.log("💾 Salvando no banco...");
    const tripData = {
      user_id: authenticatedUser.id,
      origin,
      destination,
      start_date: startDate,
      end_date: endDate,
      budget,
      budget_category: category,
      itinerary: itineraryData,
      weather_data: weatherData,
      local_cuisine: cuisineData,
    };

    const { data: trip, error } = await supabase
      .from("trips")
      .insert(tripData)
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao salvar:", error);
      return NextResponse.json(
        {
          error: "Erro ao salvar roteiro",
          details: {
            code: error.code,
            message: error.message,
            hint: error.hint,
          },
        },
        { status: 500 }
      );
    }

    console.log("✅ Roteiro salvo com sucesso! ID:", trip.id);
    console.log("=== ✅ FIM GERAÇÃO ROTEIRO ===");

    return NextResponse.json({ tripId: trip.id });
  } catch (error) {
    console.error("❌ Erro na API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
