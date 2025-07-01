import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Users,
  Camera,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const gastronomyDestinations = [
  {
    id: 1,
    name: "Belém",
    state: "Pará",
    description:
      "Culinária amazônica autêntica com ingredientes únicos da floresta",
    duration: "3-5 dias",
    budget: "R$ 1.000 - R$ 2.800",
    rating: 4.9,
    travelers: 1650,
    highlights: ["Açaí", "Tacacá", "Pato no Tucumã"],
    specialty: "Amazônica",
    restaurants: 450,
    markets: 8,
  },
  {
    id: 2,
    name: "São Paulo",
    state: "São Paulo",
    description:
      "Capital gastronômica com culinária internacional e brasileira",
    duration: "3-7 dias",
    budget: "R$ 1.500 - R$ 5.000",
    rating: 4.8,
    travelers: 4200,
    highlights: ["Liberdade", "Vila Madalena", "Mercado Municipal"],
    specialty: "Internacional",
    restaurants: 2500,
    markets: 15,
  },
  {
    id: 3,
    name: "Belo Horizonte",
    state: "Minas Gerais",
    description: "Tradição mineira com botecos históricos e comida caseira",
    duration: "2-4 dias",
    budget: "R$ 800 - R$ 2.200",
    rating: 4.7,
    travelers: 2800,
    highlights: ["Pão de Açúcar", "Feijão Tropeiro", "Cachaça"],
    specialty: "Mineira",
    restaurants: 800,
    markets: 6,
  },
  {
    id: 4,
    name: "Salvador",
    state: "Bahia",
    description: "Sabores afro-brasileiros com dendê e especiarias únicas",
    duration: "3-6 dias",
    budget: "R$ 1.200 - R$ 3.000",
    rating: 4.8,
    travelers: 2400,
    highlights: ["Acarajé", "Moqueca", "Cocada"],
    specialty: "Baiana",
    restaurants: 650,
    markets: 10,
  },
  {
    id: 5,
    name: "Recife",
    state: "Pernambuco",
    description: "Frutos do mar frescos e culinária nordestina temperada",
    duration: "3-5 days",
    budget: "R$ 1.000 - R$ 2.600",
    rating: 4.6,
    travelers: 1950,
    highlights: ["Caldinho", "Tapioca", "Cartola"],
    specialty: "Nordestina",
    restaurants: 520,
    markets: 7,
  },
  {
    id: 6,
    name: "Campos do Jordão",
    state: "São Paulo",
    description: "Gastronomia europeia com fondues e cervejas artesanais",
    duration: "2-4 dias",
    budget: "R$ 1.200 - R$ 3.500",
    rating: 4.5,
    travelers: 1400,
    highlights: ["Fondue", "Cerveja Artesanal", "Chocolate"],
    specialty: "Europeia",
    restaurants: 180,
    markets: 3,
  },
  {
    id: 7,
    name: "Bonito",
    state: "Mato Grosso do Sul",
    description:
      "Culinária pantaneira com peixes de água doce e carnes exóticas",
    duration: "4-6 dias",
    budget: "R$ 2.000 - R$ 4.500",
    rating: 4.7,
    travelers: 980,
    highlights: ["Pintado", "Pacu", "Farofa de Banana"],
    specialty: "Pantaneira",
    restaurants: 85,
    markets: 2,
  },
  {
    id: 8,
    name: "Paraty",
    state: "Rio de Janeiro",
    description: "Culinária caiçara com frutos do mar e cachaças artesanais",
    duration: "2-4 dias",
    budget: "R$ 1.100 - R$ 3.200",
    rating: 4.6,
    travelers: 1720,
    highlights: ["Moqueca Caiçara", "Cachaça", "Banana da Terra"],
    specialty: "Caiçara",
    restaurants: 120,
    markets: 4,
  },
];

export default function GastronomiaPage() {
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
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <ChefHat className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Destinos <span className="font-normal">Gastronômicos</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Sabores únicos, tradições culinárias e experiências gastronômicas
            inesquecíveis. Descubra o Brasil através de sua rica diversidade
            culinária.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="rounded-xl">
            Todos (22)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Regional (18)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Frutos do Mar (8)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Internacional (6)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Mercados (12)
          </Button>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {gastronomyDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/explore/destination/${destination.id}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-red-200 to-orange-400 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {destination.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-red-600 text-white rounded-full px-3 py-1">
                    <span className="text-xs font-medium">
                      {destination.specialty}
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
                      <span>🍽️ {destination.restaurants} rest.</span>
                      <span>🏪 {destination.markets} mercados</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {destination.highlights
                        .slice(0, 2)
                        .map((highlight, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
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
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-12">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Apaixonado por gastronomia?
          </h3>
          <p className="text-gray-600 font-light mb-8">
            Nossa IA pode criar roteiros gastronômicos com restaurantes,
            mercados e experiências culinárias únicas
          </p>
          <Link href="/planner">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl">
              Criar Roteiro Gastronômico
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
