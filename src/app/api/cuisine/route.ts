import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination");

    if (!destination) {
      return NextResponse.json(
        { error: "Destino é obrigatório" },
        { status: 400 }
      );
    }

    // Usar OpenAI para gerar informações gastronômicas
    const prompt = `
    Você é um especialista em gastronomia local. Para a cidade de ${destination}, forneça informações sobre:

    1. 3-4 pratos típicos mais famosos
    2. Ingredientes regionais característicos
    3. Cultura alimentar local
    4. 2-3 tipos de restaurantes recomendados

    Para cada prato típico, inclua:
    - Nome do prato
    - Descrição breve (2-3 linhas)
    - Ingredientes principais
    - Resumo da receita (sem detalhes excessivos)
    - Dificuldade de preparo (fácil/médio/difícil)
    - Tempo de preparo aproximado em minutos
    - Significado cultural

    Formate a resposta em JSON válido seguindo esta estrutura:
    {
      "typical_dishes": [
        {
          "name": "Nome do Prato",
          "description": "Descrição do prato",
          "ingredients": ["ingrediente1", "ingrediente2"],
          "recipe_summary": "Resumo da receita",
          "difficulty": "easy|medium|hard",
          "preparation_time": 60,
          "cultural_significance": "Significado cultural"
        }
      ],
      "local_ingredients": ["ingrediente1", "ingrediente2"],
      "food_culture": "Descrição da cultura alimentar local",
      "restaurant_recommendations": [
        {
          "name": "Tipo de Restaurante",
          "type": "categoria",
          "description": "Descrição",
          "price_range": "baixo|medio|alto",
          "specialties": ["especialidade1", "especialidade2"]
        }
      ]
    }

    Seja específico sobre ${destination} e mantenha autenticidade cultural.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("Resposta vazia da OpenAI");
    }

    // Tentar fazer parse do JSON
    let cuisineData;
    try {
      cuisineData = JSON.parse(responseText);
    } catch (parseError) {
      // Se falhar, criar uma resposta padrão
      cuisineData = {
        typical_dishes: [
          {
            name: "Prato típico local",
            description: `Especialidade tradicional de ${destination}`,
            ingredients: ["Ingredientes locais"],
            recipe_summary: "Receita tradicional da região",
            difficulty: "medium",
            preparation_time: 60,
            cultural_significance: "Prato tradicional da culinária local",
          },
        ],
        local_ingredients: ["Ingredientes da região"],
        food_culture: `A culinária de ${destination} é rica em tradições locais`,
        restaurant_recommendations: [
          {
            name: "Restaurantes tradicionais",
            type: "culinária local",
            description: "Estabelecimentos que servem comida típica",
            price_range: "medio",
            specialties: ["Pratos tradicionais"],
          },
        ],
      };
    }

    return NextResponse.json(cuisineData);
  } catch (error) {
    console.error("Erro na API de gastronomia:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
