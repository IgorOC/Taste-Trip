import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase";
import { getDaysCount, getBudgetCategory } from "@/lib/utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Verificar autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { origin, destination, startDate, endDate, budget, budget_category } =
      body;

    if (!origin || !destination || !startDate || !endDate || !budget) {
      return NextResponse.json(
        { error: "Dados obrigatórios faltando" },
        { status: 400 }
      );
    }

    const days = getDaysCount(startDate, endDate);
    const category = budget_category || getBudgetCategory(budget);

    // 1. Buscar dados do clima
    const weatherResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/weather?city=${encodeURIComponent(
        destination
      )}`
    );

    let weatherData = null;
    if (weatherResponse.ok) {
      weatherData = await weatherResponse.json();
    }

    // 2. Buscar informações gastronômicas
    const cuisineResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_APP_URL
      }/api/cuisine?destination=${encodeURIComponent(destination)}`
    );

    let cuisineData = null;
    if (cuisineResponse.ok) {
      cuisineData = await cuisineResponse.json();
    }

    // 3. Gerar roteiro com IA
    const budgetGuidelines = {
      baixo: {
        accommodation: "hostels, pousadas simples, Airbnb econômico",
        transportation: "transporte público, caminhadas, ônibus",
        food: "comida de rua, restaurantes populares, mercados locais",
        activities: "atrações gratuitas, parques, museus gratuitos",
        dailyBudget: Math.round((budget / days) * 0.8), // 80% do orçamento para gastos diários
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
    Crie um roteiro detalhado de viagem de ${days} dias para ${destination}, saindo de ${origin}.
    
    DADOS DA VIAGEM:
    - Destino: ${destination}
    - Origem: ${origin}
    - Período: ${startDate} a ${endDate} (${days} dias)
    - Orçamento total: R$ ${budget}
    - Categoria: ${category}
    - Orçamento diário sugerido: R$ ${guidelines.dailyBudget}
    
    INFORMAÇÕES DO CLIMA:
    ${weatherInfo}
    
    DIRETRIZES DE ORÇAMENTO (${category}):
    - Hospedagem: ${guidelines.accommodation}
    - Transporte: ${guidelines.transportation}
    - Alimentação: ${guidelines.food}
    - Atividades: ${guidelines.activities}
    
    INSTRUÇÕES:
    1. Crie um roteiro dia a dia realístico
    2. Inclua horários aproximados para atividades
    3. Sugira custos estimados em reais
    4. Adapte ao clima se fornecido
    5. Inclua dicas práticas e locais
    6. Mantenha-se dentro do orçamento
    
    Formate a resposta em JSON válido seguindo esta estrutura:
    {
      "days": [
        {
          "day": 1,
          "date": "${startDate}",
          "activities": [
            {
              "time": "09:00",
              "title": "Chegada e Check-in",
              "description": "Descrição detalhada",
              "location": "Nome do local",
              "estimated_cost": 100,
              "category": "accommodation"
            }
          ],
          "meals": [
            {
              "time": "lunch",
              "suggestion": "Restaurante local",
              "location": "Endereço/região",
              "estimated_cost": 40
            }
          ]
        }
      ],
      "recommendations": {
        "accommodation": ["Sugestão 1", "Sugestão 2"],
        "transportation": ["Como se locomover"],
        "activities": ["Atividade imperdível 1"]
      },
      "budget_breakdown": {
        "accommodation": 800,
        "food": 600,
        "transportation": 300,
        "activities": 300,
        "total": 2000
      }
    }
    
    Seja específico, prático e realístico com custos brasileiros atuais.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista em turismo brasileiro com conhecimento profundo sobre custos, atrações e logística de viagens. Sempre forneça informações precisas e atualizadas.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("Resposta vazia da OpenAI");
    }

    let itineraryData;
    try {
      itineraryData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta da IA:", parseError);
      throw new Error("Erro ao processar resposta da IA");
    }

    // 4. Salvar no banco de dados
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
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar viagem:", error);
      throw new Error("Erro ao salvar viagem no banco de dados");
    }

    return NextResponse.json({
      tripId: trip.id,
      message: "Roteiro gerado com sucesso!",
    });
  } catch (error) {
    console.error("Erro na API de geração de roteiro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
