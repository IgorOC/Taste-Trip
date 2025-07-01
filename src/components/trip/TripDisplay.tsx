"use client";

import { useState } from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  Cloud,
  Utensils,
  Clock,
  Users,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatDate, getBudgetLabel } from "@/lib/utils";
import type { Trip } from "@/types";

interface TripDisplayProps {
  trip: Trip;
}

export function TripDisplay({ trip }: TripDisplayProps) {
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "weather" | "cuisine"
  >("itinerary");
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Roteiro: ${trip.destination}`,
          text: `Confira meu roteiro de viagem para ${trip.destination}!`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback para copiar URL
        navigator.clipboard.writeText(window.location.href);
        alert("Link copiado para a área de transferência!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const handleDownload = () => {
    // Implementar download de PDF futuramente
    alert("Funcionalidade de download será implementada em breve!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          <MapPin className="inline h-8 w-8 text-primary-600 mr-2" />
          {trip.destination}
        </h1>
        <div className="flex flex-wrap justify-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>
              {formatCurrency(trip.budget)} (
              {getBudgetLabel(trip.budget_category)})
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === "itinerary"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📅 Roteiro
          </button>
          <button
            onClick={() => setActiveTab("weather")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === "weather"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🌤️ Clima
          </button>
          <button
            onClick={() => setActiveTab("cuisine")}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === "cuisine"
                ? "bg-white text-primary-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🍽️ Gastronomia
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "itinerary" && (
        <div className="space-y-6">
          {/* Budget Breakdown */}
          {trip.itinerary?.budget_breakdown && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">
                  💰 Resumo do Orçamento
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        trip.itinerary.budget_breakdown.accommodation
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Hospedagem</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(trip.itinerary.budget_breakdown.food)}
                    </div>
                    <div className="text-sm text-gray-600">Alimentação</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(
                        trip.itinerary.budget_breakdown.transportation
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Transporte</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(
                        trip.itinerary.budget_breakdown.activities
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Atividades</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Itinerary */}
          {trip.itinerary?.days?.map((day: any) => (
            <Card key={day.day} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleDay(day.day)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Dia {day.day} - {formatDate(day.date)}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {day.activities?.length || 0} atividades programadas
                    </p>
                  </div>
                  {expandedDays.includes(day.day) ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>

              {expandedDays.includes(day.day) && (
                <CardContent className="border-t">
                  <div className="space-y-4">
                    {day.activities?.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Clock className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {activity.time} - {activity.title}
                              </h4>
                              <p className="text-gray-600 mt-1">
                                {activity.description}
                              </p>
                              <p className="text-sm text-gray-500 mt-2">
                                📍 {activity.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-semibold text-primary-600">
                                {formatCurrency(activity.estimated_cost)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Meals */}
                    {day.meals && day.meals.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Utensils className="h-4 w-4" />
                          Refeições Sugeridas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {day.meals.map((meal: any, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-white border rounded-lg"
                            >
                              <div className="font-medium text-gray-900 capitalize">
                                {meal.time === "breakfast"
                                  ? "☀️ Café da Manhã"
                                  : meal.time === "lunch"
                                  ? "🌞 Almoço"
                                  : meal.time === "dinner"
                                  ? "🌙 Jantar"
                                  : "🍿 Lanche"}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {meal.suggestion}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                📍 {meal.location}
                              </div>
                              <div className="text-sm font-semibold text-primary-600 mt-2">
                                {formatCurrency(meal.estimated_cost)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Recommendations */}
          {trip.itinerary?.recommendations && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">
                  💡 Recomendações Gerais
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      🏨 Hospedagem
                    </h4>
                    <ul className="space-y-2">
                      {trip.itinerary.recommendations.accommodation?.map(
                        (item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      🚗 Transporte
                    </h4>
                    <ul className="space-y-2">
                      {trip.itinerary.recommendations.transportation?.map(
                        (item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      🎯 Atividades
                    </h4>
                    <ul className="space-y-2">
                      {trip.itinerary.recommendations.activities?.map(
                        (item: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Weather Tab */}
      {activeTab === "weather" && trip.weather_data && (
        <div className="space-y-6">
          {/* Current Weather */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Clima Atual em {trip.weather_data.location?.name}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary-600 mb-2">
                    {trip.weather_data.current.temperature}°C
                  </div>
                  <div className="text-lg text-gray-600 capitalize mb-4">
                    {trip.weather_data.current.description}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div>Umidade: {trip.weather_data.current.humidity}%</div>
                    <div>
                      Vento: {trip.weather_data.current.wind_speed} km/h
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Forecast */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">
                📅 Previsão para os Próximos Dias
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {trip.weather_data.forecast
                  ?.slice(0, 7)
                  .map((forecast: any, index: number) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-sm text-gray-600 mb-2">
                        {new Date(forecast.date).toLocaleDateString("pt-BR", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-1">
                        {forecast.temperature.max}°
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        {forecast.temperature.min}°
                      </div>
                      <div className="text-xs text-gray-600 capitalize">
                        {forecast.description}
                      </div>
                      {forecast.precipitation > 20 && (
                        <div className="text-xs text-blue-600 mt-1">
                          🌧️ {forecast.precipitation}%
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cuisine Tab */}
      {activeTab === "cuisine" && trip.local_cuisine && (
        <div className="space-y-6">
          {/* Food Culture */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Cultura Gastronômica
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {trip.local_cuisine.food_culture}
              </p>
            </CardContent>
          </Card>

          {/* Typical Dishes */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">🍽️ Pratos Típicos</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trip.local_cuisine.typical_dishes?.map(
                  (dish: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {dish.name}
                      </h4>
                      <p className="text-gray-600 mb-4">{dish.description}</p>

                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-900">
                            Ingredientes:
                          </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {dish.ingredients?.map(
                              (ingredient: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                >
                                  {ingredient}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-gray-900">
                            Preparo:
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {dish.recipe_summary}
                          </p>
                        </div>

                        <div className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium">Dificuldade:</span>
                            <span
                              className={`ml-1 px-2 py-1 rounded text-xs ${
                                dish.difficulty === "easy"
                                  ? "bg-green-100 text-green-700"
                                  : dish.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {dish.difficulty === "easy"
                                ? "Fácil"
                                : dish.difficulty === "medium"
                                ? "Médio"
                                : "Difícil"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Tempo:</span>
                            <span className="ml-1 text-gray-600">
                              {dish.preparation_time} min
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="font-medium text-gray-900">
                            Significado Cultural:
                          </span>
                          <p className="text-xs text-gray-600 mt-1">
                            {dish.cultural_significance}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Local Ingredients */}
          {trip.local_cuisine.local_ingredients && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">
                  🌿 Ingredientes Locais
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {trip.local_cuisine.local_ingredients.map(
                    (ingredient: string, index: number) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Restaurant Recommendations */}
          {trip.local_cuisine.restaurant_recommendations && (
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">
                  🏪 Restaurantes Recomendados
                </h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trip.local_cuisine.restaurant_recommendations.map(
                    (restaurant: any, index: number) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {restaurant.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {restaurant.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Tipo:</span>
                            <span className="text-xs text-gray-700">
                              {restaurant.type}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Preço:
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                restaurant.price_range === "baixo"
                                  ? "bg-green-100 text-green-700"
                                  : restaurant.price_range === "medio"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {restaurant.price_range === "baixo"
                                ? "Econômico"
                                : restaurant.price_range === "medio"
                                ? "Médio"
                                : "Alto"}
                            </span>
                          </div>

                          {restaurant.specialties && (
                            <div>
                              <span className="text-xs text-gray-500">
                                Especialidades:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {restaurant.specialties.map(
                                  (specialty: string, i: number) => (
                                    <span
                                      key={i}
                                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >
                                      {specialty}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
