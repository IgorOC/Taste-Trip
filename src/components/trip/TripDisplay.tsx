"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Star,
  Utensils,
  Camera,
  Info,
} from "lucide-react";

interface TripDisplayProps {
  trip: any;
}

export function TripDisplay({ trip }: TripDisplayProps) {
  const [itinerary, setItinerary] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [cuisine, setCuisine] = useState<any>(null);

  useEffect(() => {
    if (trip?.itinerary) {
      console.log("📊 Dados completos do trip:", trip);
      console.log("🗓️ Itinerary data:", trip.itinerary);
      console.log("🌤️ Weather data:", trip.weather_data);
      console.log("🍽️ Cuisine data:", trip.local_cuisine);

      setItinerary(trip.itinerary);
      setWeather(trip.weather_data);
      setCuisine(trip.local_cuisine);
    }
  }, [trip]);

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando roteiro...</p>
        </div>
      </div>
    );
  }

  // Função para renderizar dados de forma segura
  const renderValue = (value: any, fallback: string = "Não informado") => {
    if (!value || value === "" || value === "{}") return fallback;
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header do Roteiro */}
      <div className="gradient-bg rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {renderValue(
            itinerary.overview?.title,
            `Roteiro para ${trip.destination}`
          )}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="flex flex-col items-center p-4 bg-white/50 rounded-xl">
            <MapPin className="h-6 w-6 text-teal-600 mb-2" />
            <span className="text-sm text-gray-600">Destino</span>
            <span className="font-semibold">{trip.destination}</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-white/50 rounded-xl">
            <Calendar className="h-6 w-6 text-teal-600 mb-2" />
            <span className="text-sm text-gray-600">Período</span>
            <span className="font-semibold">
              {new Date(trip.start_date).toLocaleDateString("pt-BR")} -{" "}
              {new Date(trip.end_date).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="flex flex-col items-center p-4 bg-white/50 rounded-xl">
            <Users className="h-6 w-6 text-teal-600 mb-2" />
            <span className="text-sm text-gray-600">Viajantes</span>
            <span className="font-semibold">{trip.adults || 1} adulto(s)</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-white/50 rounded-xl">
            <DollarSign className="h-6 w-6 text-teal-600 mb-2" />
            <span className="text-sm text-gray-600">Orçamento</span>
            <span className="font-semibold">R$ {trip.budget}</span>
          </div>
        </div>
      </div>

      {/* Clima Atual */}
      {weather && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="text-2xl mr-3">🌤️</span>
            Clima em {trip.destination}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-900 font-semibold">Agora</p>
              <p className="text-2xl font-bold text-blue-700">
                {weather.current?.temperature}°C
              </p>
              <p className="text-blue-600 capitalize">
                {weather.current?.description}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-green-900 font-semibold">Umidade</p>
              <p className="text-2xl font-bold text-green-700">
                {weather.current?.humidity}%
              </p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-purple-900 font-semibold">Vento</p>
              <p className="text-2xl font-bold text-purple-700">
                {weather.current?.wind_speed} km/h
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gastronomia Local */}
      {cuisine && cuisine.typical_dishes && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Utensils className="h-6 w-6 text-orange-600 mr-3" />
            Gastronomia Local
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cuisine.typical_dishes
              .slice(0, 4)
              .map((dish: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <h3 className="font-semibold text-lg mb-2">{dish.name}</h3>
                  <p className="text-gray-600 mb-3">{dish.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {dish.preparation_time}min
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {dish.difficulty === "easy"
                        ? "Fácil"
                        : dish.difficulty === "medium"
                        ? "Médio"
                        : "Difícil"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Introdução */}
      {itinerary.overview?.introduction && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Info className="h-6 w-6 text-teal-600 mr-3" />
            Sobre sua viagem
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {renderValue(
              itinerary.overview.introduction,
              "Uma experiência incrível te aguarda neste destino!"
            )}
          </p>
        </div>
      )}

      {/* Roteiro por Dias */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Seu Roteiro Detalhado
        </h2>

        {itinerary.days &&
        Array.isArray(itinerary.days) &&
        itinerary.days.length > 0 ? (
          itinerary.days.map((day: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="bg-teal-100 text-teal-800 rounded-full w-10 h-10 flex items-center justify-center font-bold mr-4">
                  {day.day || index + 1}
                </div>
                <h3 className="text-2xl font-semibold">
                  Dia {day.day || index + 1} -{" "}
                  {renderValue(day.title, "Explorando a cidade")}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manhã */}
                <div className="space-y-4">
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      🌅 Manhã
                    </h4>
                    <p className="text-yellow-800">
                      {renderValue(
                        day.morning?.description,
                        "Comece o dia explorando as principais atrações locais."
                      )}
                    </p>
                    {day.morning?.tip && (
                      <div className="mt-2 p-3 bg-yellow-100 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          💡 <strong>Dica:</strong>{" "}
                          {renderValue(day.morning.tip)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tarde */}
                  <div className="bg-orange-50 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-900 mb-2">
                      ☀️ Tarde
                    </h4>
                    <p className="text-orange-800">
                      {renderValue(
                        day.afternoon?.activity,
                        "Continue sua exploração com atividades culturais."
                      )}
                    </p>
                    {day.afternoon?.location && (
                      <p className="text-sm text-orange-600 mt-1">
                        📍 {renderValue(day.afternoon.location)}
                      </p>
                    )}
                    {day.afternoon?.tip && (
                      <div className="mt-2 p-3 bg-orange-100 rounded-lg">
                        <p className="text-sm text-orange-700">
                          💡 <strong>Dica:</strong>{" "}
                          {renderValue(day.afternoon.tip)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Refeições e Noite */}
                <div className="space-y-4">
                  {/* Almoço */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      🍽️ Almoço
                    </h4>
                    <p className="text-green-800">
                      {renderValue(
                        day.lunch?.description,
                        "Experimente a culinária local em restaurantes típicos."
                      )}
                    </p>
                    {day.lunch?.tip && (
                      <div className="mt-2 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm text-green-700">
                          💡 <strong>Dica:</strong> {renderValue(day.lunch.tip)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Jantar e Noite */}
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      🌙 Noite
                    </h4>
                    <p className="text-purple-800 mb-2">
                      <strong>Jantar:</strong>{" "}
                      {renderValue(
                        day.dinner?.name,
                        "Restaurante local recomendado"
                      )}
                    </p>
                    {day.night_activity && (
                      <p className="text-purple-800">
                        <strong>Atividade:</strong>{" "}
                        {renderValue(day.night_activity)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
            <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Roteiro em Preparação
            </h3>
            <p className="text-gray-500">
              Os detalhes do seu roteiro estão sendo finalizados. Tente gerar um
              novo roteiro com mais informações.
            </p>
          </div>
        )}
      </div>

      {/* Dicas Finais */}
      {itinerary.final_tips && (
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            🎯 Dicas Essenciais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: "🚗",
                label: "Transporte",
                value: itinerary.final_tips.transportation,
              },
              {
                icon: "🌡️",
                label: "Clima",
                value: itinerary.final_tips.weather,
              },
              {
                icon: "💰",
                label: "Gorjetas",
                value: itinerary.final_tips.tipping,
              },
              {
                icon: "🛡️",
                label: "Segurança",
                value: itinerary.final_tips.safety,
              },
              {
                icon: "🎭",
                label: "Cultura",
                value: itinerary.final_tips.local_culture,
              },
              {
                icon: "🛍️",
                label: "Compras",
                value: itinerary.final_tips.shopping,
              },
            ].map(
              (tip, index) =>
                tip.value && (
                  <div key={index} className="bg-white rounded-xl p-4">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <span className="text-xl mr-2">{tip.icon}</span>
                      {tip.label}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {renderValue(tip.value)}
                    </p>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
