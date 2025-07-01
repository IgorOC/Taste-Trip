import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Users,
  Camera,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const beachDestinations = [
  {
    id: 1,
    name: "Florianópolis",
    state: "Santa Catarina",
    description:
      "Ilha da Magia com 42 praias paradisíacas e vida noturna agitada",
    duration: "4-7 dias",
    budget: "R$ 1.800 - R$ 4.500",
    rating: 4.8,
    travelers: 2150,
    highlights: ["Praia Mole", "Lagoa da Conceição", "Centro Histórico"],
    season: "Dez - Mar",
    temperature: "25-30°C",
  },
  {
    id: 2,
    name: "Porto de Galinhas",
    state: "Pernambuco",
    description: "Águas cristalinas, piscinas naturais e cultura nordestina",
    duration: "3-6 dias",
    budget: "R$ 1.500 - R$ 3.800",
    rating: 4.9,
    travelers: 1820,
    highlights: [
      "Piscinas Naturais",
      "Praia de Maracaípe",
      "Pontal de Maracaípe",
    ],
    season: "Set - Mar",
    temperature: "26-32°C",
  },
  {
    id: 3,
    name: "Jericoacoara",
    state: "Ceará",
    description:
      "Dunas, lagoas azuis e um dos mais belos pores do sol do mundo",
    duration: "4-8 dias",
    budget: "R$ 1.200 - R$ 3.200",
    rating: 4.7,
    travelers: 1450,
    highlights: ["Duna do Pôr do Sol", "Lagoa Azul", "Pedra Furada"],
    season: "Jul - Dez",
    temperature: "24-30°C",
  },
  {
    id: 4,
    name: "Búzios",
    state: "Rio de Janeiro",
    description: "Charme internacional, praias diversas e gastronomia refinada",
    duration: "2-5 dias",
    budget: "R$ 2.000 - R$ 5.500",
    rating: 4.6,
    travelers: 1680,
    highlights: ["Rua das Pedras", "Praia da Ferradura", "Orla Bardot"],
    season: "Abr - Out",
    temperature: "20-28°C",
  },
  {
    id: 5,
    name: "Morro de São Paulo",
    state: "Bahia",
    description:
      "Paraíso tropical sem carros, com praias selvagens e vida noturna",
    duration: "3-7 dias",
    budget: "R$ 1.000 - R$ 2.800",
    rating: 4.5,
    travelers: 1290,
    highlights: ["Quarta Praia", "Segunda Praia", "Tirolesa"],
    season: "Set - Mar",
    temperature: "25-31°C",
  },
  {
    id: 6,
    name: "Fernando de Noronha",
    state: "Pernambuco",
    description: "Santuário ecológico com as mais belas praias do Brasil",
    duration: "4-7 dias",
    budget: "R$ 4.000 - R$ 12.000",
    rating: 4.9,
    travelers: 890,
    highlights: ["Baía do Sancho", "Dois Irmãos", "Projeto Tamar"],
    season: "Abr - Nov",
    temperature: "26-30°C",
  },
  {
    id: 7,
    name: "Ilha Grande",
    state: "Rio de Janeiro",
    description: "Natureza preservada, trilhas e praias de águas cristalinas",
    duration: "2-5 dias",
    budget: "R$ 800 - R$ 2.500",
    rating: 4.7,
    travelers: 1540,
    highlights: ["Lopes Mendes", "Lagoa Azul", "Vila do Abraão"],
    season: "Mar - Nov",
    temperature: "22-28°C",
  },
  {
    id: 8,
    name: "Maragogi",
    state: "Alagoas",
    description: "Caribe brasileiro com piscinas naturais e recifes de corais",
    duration: "3-6 dias",
    budget: "R$ 1.400 - R$ 3.600",
    rating: 4.8,
    travelers: 1120,
    highlights: ["Galés de Maragogi", "Praia de Antunes", "São Bento"],
    season: "Set - Mar",
    temperature: "25-30°C",
  },
];

export default function PraiasPage() {
  return (
    <main className="py-8">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <Link
          href="/explore"
          className="inline-flex items-center text-teal-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Explorar
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Waves className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Destinos de <span className="font-normal">Praia</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Sol, mar e relaxamento. Descubra as mais belas praias do Brasil,
            desde paraísos tropicais até refúgios urbanos à beira-mar.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="rounded-xl">
            Todos (25)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Nordeste (12)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Sudeste (8)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Sul (3)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Ilhas (5)
          </Button>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {beachDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/explore/destination/${destination.id}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {destination.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white rounded-full px-3 py-1">
                    <span className="text-xs font-medium">
                      {destination.season}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-medium text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {destination.state}
                  </p>
                  <p className="text-gray-600 font-light mb-4 line-clamp-2 flex-1">
                    {destination.description}
                  </p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {destination.duration}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {destination.travelers}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-teal-600 font-medium">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {destination.budget}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>🌡️ {destination.temperature}</span>
                      <span>📍 {destination.highlights[0]}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {destination.highlights
                        .slice(0, 2)
                        .map((highlight, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      {destination.highlights.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{destination.highlights.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 lg:px-8 mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-3xl p-12">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Não encontrou a praia ideal?
          </h3>
          <p className="text-gray-600 font-light mb-8">
            Nossa IA pode criar um roteiro personalizado para qualquer destino
            de praia
          </p>
          <Link href="/planner">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl">
              Criar Roteiro Personalizado
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
