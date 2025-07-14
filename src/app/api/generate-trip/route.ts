import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { getDaysCount, getBudgetCategory } from "@/lib/utils";
import { cookies } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 🔍 DEBUG: Vamos ver o que está acontecendo
    console.log("=== DEBUG AUTENTICAÇÃO ===");

    // Verificar cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log(
      "Todos os cookies:",
      allCookies.map((c) => c.name)
    );

    // Verificar headers
    const authHeader = request.headers.get("authorization");
    console.log("Header Authorization:", authHeader);

    // Criar cliente Supabase para servidor
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // No-op para API routes
          },
          remove(name: string, options: any) {
            // No-op para API routes
          },
        },
      }
    );

    // Tentar obter usuário com mais detalhes
    let {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("Usuário obtido:", user ? user.id : "null");
    console.log("Erro ao obter usuário:", userError);

    // Se não conseguir pelo método normal, tente pelo token dos cookies
    if (!user) {
      console.log("Tentando método alternativo...");

      // Procurar token nos cookies
      const authCookie = allCookies.find(
        (cookie) =>
          cookie.name.includes("auth-token") &&
          cookie.name.includes("shdzhrdzfszbrtdvadpk") // Seu projeto atual
      );

      console.log("Cookie de auth encontrado:", authCookie ? "SIM" : "NÃO");

      if (authCookie) {
        try {
          // Decodificar o token do cookie (formato base64)
          let cookieValue = decodeURIComponent(authCookie.value);

          // Remover o prefixo "base64-" se presente
          if (cookieValue.startsWith("base64-")) {
            cookieValue = cookieValue.substring(7); // Remove "base64-"
            cookieValue = atob(cookieValue); // Decode base64
          }

          const tokenData = JSON.parse(cookieValue);
          console.log(
            "Token decodificado:",
            tokenData.access_token ? "Token presente" : "Token ausente"
          );

          // Tentar definir a sessão manualmente - use o mesmo cliente do servidor
          const serverSupabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
              cookies: {
                get(name: string) {
                  return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: any) {
                  // No-op para API routes
                },
                remove(name: string, options: any) {
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

          console.log(
            "Sessão definida:",
            sessionData.user ? "SUCESSO" : "FALHOU"
          );
          console.log("Erro da sessão:", sessionError);

          if (sessionData.user) {
            // Definir o usuário para continuar o processamento
            user = sessionData.user;
            console.log("✅ Usuário autenticado via cookie!");
          }
        } catch (parseError) {
          console.log("Erro ao processar cookie:", parseError);
        }
      }

      // Se ainda não conseguiu autenticar
      if (!user) {
        return NextResponse.json(
          {
            error: "Usuário não autenticado",
            debug: {
              userFound: !!user,
              cookiesCount: allCookies.length,
              authCookieFound: !!allCookies.find((c) =>
                c.name.includes("auth-token")
              ),
            },
          },
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

    console.log("✅ Prosseguindo com a geração do roteiro...");

    const days = getDaysCount(startDate, endDate);
    const category = budget_category || getBudgetCategory(budget);

    // Usar URL base dinamicamente
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const weatherResponse = await fetch(
      `${baseUrl}/api/weather?city=${encodeURIComponent(destination)}`
    );

    let weatherData = null;
    if (weatherResponse.ok) {
      weatherData = await weatherResponse.json();
    }

    const cuisineResponse = await fetch(
      `${baseUrl}/api/cuisine?destination=${encodeURIComponent(destination)}`
    );

    let cuisineData = null;
    if (cuisineResponse.ok) {
      cuisineData = await cuisineResponse.json();
    }

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

    const guidelines =
      budgetGuidelines[category as keyof typeof budgetGuidelines];
    const weatherInfo = weatherData
      ? `Clima atual: ${weatherData.current.description}, ${weatherData.current.temperature}°C`
      : "";

    const prompt = `
Crie um roteiro de viagem para ${destination}, saindo de ${origin}, com duração de ${days} dias (de ${startDate} a ${endDate}), orçamento total de R${budget} (${category}), estilo de viagem: ${
      travelStyle || "não informado"
    }, transporte preferido: ${
      transportPreference || "não informado"
    }, hospedagem: ${accommodationPreference || "não informada"}.

INFORMAÇÕES ADICIONAIS:
- Título do Roteiro: ${title || "Roteiro Personalizado"}
- Viajantes: ${adults} adulto(s) ${childrenString ? `e ${childrenString}` : ""}
- Restrições alimentares: ${dietaryRestrictions || "nenhuma"}
- Acessibilidade: ${accessibility || "nenhuma"}
- Interesses principais: ${interests?.join(", ") || "não informados"}
- Observações: ${specialNotes || "nenhuma"}
- Clima (se disponível): ${weatherInfo}

Siga a estrutura JSON com overview, days e final_tips.
Responda apenas com o JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em turismo com conhecimento profundo sobre custos, atrações, restaurantes locais e logística de viagens.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("Resposta vazia da OpenAI");
    }

    console.log(
      "Resposta bruta da IA:",
      responseText.substring(0, 200) + "..."
    );

    let itineraryData;
    try {
      // Limpar a resposta removendo blocos de código markdown
      let cleanedResponse = responseText.trim();

      // Remover ```json do início
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.substring(7);
      }

      // Remover ``` do final
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.substring(
          0,
          cleanedResponse.length - 3
        );
      }

      // Remover qualquer whitespace extra
      cleanedResponse = cleanedResponse.trim();

      console.log("JSON limpo:", cleanedResponse.substring(0, 200) + "...");

      itineraryData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta:", parseError);
      console.error("Resposta completa:", responseText);
      throw new Error("Erro ao processar resposta da IA");
    }

    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        origin,
        destination,
        start_date: startDate,
        end_date: endDate,
        budget,
        budget_category: category,
        itinerary: itineraryData,
        weather_data: weatherData,
        local_cuisine: cuisineData,
        // Removidos todos os campos que não existem na tabela:
        // title, adults, children_string, travel_style, transport_preference,
        // accommodation_preference, dietary_restrictions, accessibility,
        // special_notes, interests
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar:", error);
      throw new Error("Erro ao salvar roteiro");
    }

    return NextResponse.json({ tripId: trip.id });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
