import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Users,
  Camera,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const adventureDestinations = [
  {
    id: 1,
    name: "Chapada Diamantina",
    state: "Bahia",
    description: "Cachoeiras gigantes, grutas místicas e trilhas desafiadoras",
    duration: "4-7 dias",
    budget: "R$ 1.500 - R$ 3.500",
    rating: 4.9,
    travelers: 1850,
    highlights: ["Cachoeira da Fumaça", "Morro do Pai Inácio", "Gruta Azul"],
    activities: ["Trekking", "Rapel", "Escalada"],
    difficulty: "Moderado",
    altitude: "1.700m",
  },
  {
    id: 2,
    name: "Brotas",
    state: "São Paulo",
    description: "Capital da aventura com rafting, tirolesa e ecoturismo",
    duration: "2-4 dias",
    budget: "R$ 800 - R$ 2.200",
    rating: 4.7,
    travelers: 2200,
    highlights: ["Rafting no Jacaré", "Tirolesa", "Arvorismo"],
    activities: ["Rafting", "Tirolesa", "Canoagem"],
    difficulty: "Fácil",
    altitude: "650m",
  },
  {
    id: 3,
    name: "Capitólio",
    state: "Minas Gerais",
    description: "Cânions espetaculares e esportes aquáticos no lago",
    duration: "2-4 dias",
    budget: "R$ 900 - R$ 2.500",
    rating: 4.8,
    travelers: 1650,
    highlights: ["Cânions de Furnas", "Cachoeira Diquada", "Escarpas"],
    activities: ["Wakeboard", "Stand Up", "Trilha"],
    difficulty: "Moderado",
    altitude: "860m",
  },
  {
    id: 4,
    name: "Itacaré",
    state: "Bahia",
    description: "Surf de classe mundial e trilhas pela Mata Atlântica",
    duration: "3-6 dias",
    budget: "R$ 1.200 - R$ 3.000",
    rating: 4.6,
    travelers: 1420,
    highlights: [
      "Praia da Tiririca",
      "Trilha das 4 Praias",
      "Cachoeira do Cleandro",
    ],
    activities: ["Surf", "Trilha", "Rapel"],
    difficulty: "Moderado",
    altitude: "0-200m",
  },
  {
    id: 5,
    name: "São Bento do Sapucaí",
    state: "São Paulo",
    description: "Voo livre, escalada e trilhas na Serra da Mantiqueira",
    duration: "2-4 dias",
    budget: "R$ 700 - R$ 2.000",
    rating: 4.7,
    travelers: 980,
    highlights: ["Pedra do Baú", "Voo Livre", "Escalada"],
    activities: ["Voo Livre", "Escalada", "Trekking"],
    difficulty: "Difícil",
    altitude: "1.950m",
  },
  {
    id: 6,
    name: "Jalapão",
    state: "Tocantins",
    description: "Dunas douradas, fervedouros e expedições 4x4",
    duration: "5-8 dias",
    budget: "R$ 2.500 - R$ 5.000",
    rating: 4.8,
    travelers: 750,
    highlights: ["Dunas do Jalapão", "Fervedouro", "Cachoeira da Velha"],
    activities: ["4x4", "Sandboard", "Trekking"],
    difficulty: "Moderado",
    altitude: "500m",
  },
  {
    id: 7,
    name: "Socorro",
    state: "São Paulo",
    description: "Rafting no Rio do Peixe e aventuras na natureza",
    duration: "2-3 dias",
    budget: "R$ 600 - R$ 1.800",
    rating: 4.5,
    travelers: 1350,
    highlights: ["Rafting Classe IV", "Boia Cross", "Arvorismo"],
    activities: ["Rafting", "Boia Cross", "Arvorismo"],
    difficulty: "Moderado",
    altitude: "750m",
  },
  {
    id: 8,
    name: "Monte Roraima",
    state: "Roraima",
    description: "Trekking épico ao tepui mais famoso da América do Sul",
    duration: "6-8 dias",
    budget: "R$ 3.000 - R$ 6.000",
    rating: 4.9,
    travelers: 420,
    highlights: ["Tepui", "Vale dos Cristais", "Ponto Triplo"],
    activities: ["Trekking", "Camping", "Fotografia"],
    difficulty: "Difícil",
    altitude: "2.810m",
  },
];

export default function AventuraPage() {
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
            <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Destinos de <span className="font-normal">Aventura</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Adrenalina pura, esportes radicais e desafios na natureza. Para quem
            busca experiências emocionantes e inesquecíveis.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="rounded-xl">
            Todos (15)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Fácil (4)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Moderado (8)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Difícil (3)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Aquático (6)
          </Button>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {adventureDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/explore/destination/${destination.id}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-yellow-200 to-orange-500 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {destination.rating}
                    </span>
                  </div>
                  <div
                    className={`absolute top-4 left-4 text-white rounded-full px-3 py-1 text-xs font-medium ${
                      destination.difficulty === "Fácil"
                        ? "bg-green-600"
                        : destination.difficulty === "Moderado"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {destination.difficulty}
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
                      <span>⛰️ {destination.altitude}</span>
                      <span>🎯 {destination.activities[0]}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {destination.activities
                        .slice(0, 2)
                        .map((activity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                      {destination.activities.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{destination.activities.length - 2}
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
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-12">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Buscando adrenalina?
          </h3>
          <p className="text-gray-600 font-light mb-8">
            Nossa IA pode criar roteiros de aventura personalizados com
            atividades radicais e experiências únicas
          </p>
          <Link href="/planner">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl">
              Criar Roteiro de Aventura
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
