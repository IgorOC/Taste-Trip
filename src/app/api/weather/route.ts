import { NextRequest, NextResponse } from "next/server";

interface WeatherParams {
  city: string;
  country?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");

    if (!city) {
      return NextResponse.json(
        { error: "Cidade é obrigatória" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key do OpenWeather não configurada" },
        { status: 500 }
      );
    }

    // Primeiro, buscar coordenadas da cidade
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${apiKey}`;

    const geoResponse = await fetch(geocodingUrl);
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      return NextResponse.json(
        { error: "Cidade não encontrada" },
        { status: 404 }
      );
    }

    const { lat, lon } = geoData[0];

    // Buscar dados do clima atual e previsão
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&lang=pt_br&appid=${apiKey}`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Erro ao buscar dados do clima");
    }

    const weatherData = await weatherResponse.json();

    // Formatar dados para nosso formato
    const formattedData = {
      current: {
        temperature: Math.round(weatherData.current.temp),
        description: weatherData.current.weather[0].description,
        humidity: weatherData.current.humidity,
        wind_speed: weatherData.current.wind_speed,
        icon: weatherData.current.weather[0].icon,
      },
      forecast: weatherData.daily.slice(0, 7).map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString().split("T")[0],
        temperature: {
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max),
        },
        description: day.weather[0].description,
        icon: day.weather[0].icon,
        precipitation: Math.round((day.pop || 0) * 100), // Probabilidade de chuva em %
      })),
      location: {
        name: geoData[0].name,
        country: geoData[0].country,
        state: geoData[0].state || "",
      },
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Erro na API do clima:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
