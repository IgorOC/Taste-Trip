import { NextRequest, NextResponse } from "next/server";

interface TripForecast {
  date: string;
  dayName: string;
  temperature: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
}

interface ForecastDay {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    // Se temos datas de início e fim, calcular previsão específica para a viagem
    const dailyForecast: TripForecast[] = [];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();

      // Calcular quantos dias até o início da viagem
      const daysUntilStart = Math.ceil(
        (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calcular duração da viagem
      const tripDuration = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Pegar previsão para os dias da viagem (máximo 8 dias no OpenWeather free)
      const forecastStart = Math.max(0, Math.min(daysUntilStart, 7));
      const forecastEnd = Math.min(forecastStart + tripDuration, 8);

      for (let i = forecastStart; i < forecastEnd; i++) {
        if (weatherData.daily[i]) {
          const day = weatherData.daily[i];
          const date = new Date(day.dt * 1000);

          // Calcular dia da semana em português
          const weekdays = [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
          ];
          const dayName = weekdays[date.getDay()];

          dailyForecast.push({
            date: date.toISOString().split("T")[0],
            dayName: dayName,
            temperature: Math.round((day.temp.min + day.temp.max) / 2), // Temperatura média
            tempMin: Math.round(day.temp.min),
            tempMax: Math.round(day.temp.max),
            description: day.weather[0].description,
            icon: day.weather[0].icon,
          });
        }
      }
    }

    // Formatar dados para nosso formato
    const formattedData = {
      current: {
        temperature: Math.round(weatherData.current.temp),
        description: weatherData.current.weather[0].description,
        icon: weatherData.current.weather[0].icon,
      },
      forecast: weatherData.daily.slice(0, 7).map((day: ForecastDay) => ({
        date: new Date(day.dt * 1000).toISOString().split("T")[0],
        temperature: {
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max),
        },
        description: day.weather[0].description,
        icon: day.weather[0].icon,
      })),
      // Nova seção específica para a viagem
      tripForecast: dailyForecast,
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
