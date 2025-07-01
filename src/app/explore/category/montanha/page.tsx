import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Users,
  Camera,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const mountainDestinations = [
  {
    id: 1,
    name: "Gramado",
    state: "Rio Grande do Sul",
    description:
      "Arquitetura europeia, chocolate artesanal e clima de montanha",
    duration: "3-5 dias",
    budget: "R$ 1.200 - R$ 3.500",
    rating: 4.9,
    travelers: 3200,
    highlights: ["Lago Negro", "Mini Mundo", "Festival de Inverno"],
    season: "Jun - Set",
    temperature: "8-18°C",
    altitude: "830m",
  },
  {
    id: 2,
    name: "Campos do Jordão",
    state: "São Paulo",
    description:
      "Suíça brasileira com cervejas artesanais e paisagens montanhosas",
    duration: "2-4 dias",
    budget: "R$ 1.000 - R$ 2.800",
    rating: 4.7,
    travelers: 2800,
    highlights: ["Horto Florestal", "Bondinho", "Festival de Inverno"],
    season: "Mai - Ago",
    temperature: "5-20°C",
    altitude: "1.628m",
  },
  {
    id: 3,
    name: "Monte Verde",
    state: "Minas Gerais",
    description: "Refúgio montanhoso com cachoeiras e trilhas ecológicas",
    duration: "2-4 dias",
    budget: "R$ 800 - R$ 2.200",
    rating: 4.6,
    travelers: 1850,
    highlights: ["Cachoeira Véu da Noiva", "Trilha do Pico", "Aventura Park"],
    season: "Mai - Set",
    temperature: "10-22°C",
    altitude: "1.555m",
  },
  {
    id: 4,
    name: "Canela",
    state: "Rio Grande do Sul",
    description: "Natureza exuberante com cachoeiras e gastronomia alemã",
    duration: "3-5 dias",
    budget: "R$ 1.100 - R$ 3.200",
    rating: 4.8,
    travelers: 2950,
    highlights: [
      "Cascata do Caracol",
      "Parque Terra Mágica",
      "Catedral de Pedra",
    ],
    season: "Abr - Set",
    temperature: "6-19°C",
    altitude: "837m",
  },
  {
    id: 5,
    name: "São Bento do Sapucaí",
    state: "São Paulo",
    description: "Portal de entrada da Mantiqueira com voo livre e aventura",
    duration: "2-4 dias",
    budget: "R$ 600 - R$ 1.800",
    rating: 4.5,
    travelers: 1420,
    highlights: ["Pedra do Baú", "Voo Livre", "Cachoeira dos Amores"],
    season: "Abr - Out",
    temperature: "12-25°C",
    altitude: "888m",
  },
  {
    id: 6,
    name: "Petrópolis",
    state: "Rio de Janeiro",
    description: "Cidade Imperial com museus, palácios e clima serrano",
    duration: "2-3 dias",
    budget: "R$ 800 - R$ 2.000",
    rating: 4.4,
    travelers: 2100,
    highlights: ["Museu Imperial", "Casa de Santos Dumont", "Quitandinha"],
    season: "Mar - Nov",
    temperature: "15-25°C",
    altitude: "845m",
  },
  {
    id: 7,
    name: "Visconde de Mauá",
    state: "Rio de Janeiro",
    description: "Vale encantado com pousadas charmosas e natureza",
    duration: "2-4 dias",
    budget: "R$ 900 - R$ 2.500",
    rating: 4.6,
    travelers: 1650,
    highlights: ["Santa Clara", "Maringá", "Cachoeira do Escorrega"],
    season: "Abr - Out",
    temperature: "10-23°C",
    altitude: "1.200m",
  },
  {
    id: 8,
    name: "Nova Friburgo",
    state: "Rio de Janeiro",
    description: "Região serrana com flores, chocolate e ecoturismo",
    duration: "2-4 dias",
    budget: "R$ 700 - R$ 1.900",
    rating: 4.3,
    travelers: 1380,
    highlights: ["Pico da Caledônia", "Country Clube", "Lumiar"],
    season: "Mar - Nov",
    temperature: "12-24°C",
    altitude: "846m",
  },
];

export default function MontanhaPage() {
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
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <Mountain className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Destinos de <span className="font-normal">Montanha</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Clima frio, paisagens deslumbrantes e aconchego. Descubra refúgios
            montanhosos perfeitos para relaxar e se reconectar com a natureza.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="rounded-xl">
            Todos (18)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Serra Gaúcha (4)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Mantiqueira (6)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Região Serrana (5)
          </Button>
          <Button variant="outline" className="rounded-xl">
            + 1.000m altitude (8)
          </Button>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mountainDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/explore/destination/${destination.id}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-200 to-green-500 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {destination.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-green-600 text-white rounded-full px-3 py-1">
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
                      <span>⛰️ {destination.altitude}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {destination.highlights
                        .slice(0, 2)
                        .map((highlight, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
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
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-12">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Procurando um refúgio na montanha?
          </h3>
          <p className="text-gray-600 font-light mb-8">
            Nossa IA pode criar um roteiro personalizado para destinos serranos
            e montanhosos
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
