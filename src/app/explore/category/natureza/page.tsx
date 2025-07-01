// src/app/explore/category/natureza/page.tsx
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Users,
  Camera,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const natureDestinations = [
  {
    id: 1,
    name: "Pantanal",
    state: "Mato Grosso do Sul",
    description: "Maior planície alagada do mundo com vida selvagem abundante",
    duration: "4-7 dias",
    budget: "R$ 2.500 - R$ 6.000",
    rating: 4.9,
    travelers: 1200,
    highlights: ["Onças-pintadas", "Jacarés", "Aves exóticas"],
    ecosystem: "Wetland",
    wildlife: 656,
    conservation: "UNESCO",
  },
  {
    id: 2,
    name: "Amazônia",
    state: "Amazonas",
    description: "Floresta tropical mais diversa do planeta com rios imensos",
    duration: "5-10 dias",
    budget: "R$ 3.000 - R$ 8.000",
    rating: 4.8,
    travelers: 950,
    highlights: [
      "Encontro das Águas",
      "Botos Cor-de-Rosa",
      "Árvores Centenárias",
    ],
    ecosystem: "Floresta Tropical",
    wildlife: 2500,
    conservation: "UNESCO",
  },
  {
    id: 3,
    name: "Chapada dos Veadeiros",
    state: "Goiás",
    description:
      "Cerrado preservado com cachoeiras cristalinas e formações rochosas",
    duration: "3-6 dias",
    budget: "R$ 1.200 - R$ 3.200",
    rating: 4.7,
    travelers: 1850,
    highlights: ["Vale da Lua", "Cachoeira Santa Bárbara", "Cânions"],
    ecosystem: "Cerrado",
    wildlife: 320,
    conservation: "UNESCO",
  },
  {
    id: 4,
    name: "Fernando de Noronha",
    state: "Pernambuco",
    description:
      "Santuário marinho com biodiversidade única e controle ambiental",
    duration: "4-7 dias",
    budget: "R$ 4.000 - R$ 12.000",
    rating: 4.9,
    travelers: 890,
    highlights: ["Golfinhos Rotadores", "Tartarugas Marinhas", "Tubarões"],
    ecosystem: "Marinho",
    wildlife: 230,
    conservation: "UNESCO",
  },
  {
    id: 5,
    name: "Bonito",
    state: "Mato Grosso do Sul",
    description:
      "Águas cristalinas e turismo sustentável em ecossistema preservado",
    duration: "4-6 dias",
    budget: "R$ 2.000 - R$ 5.000",
    rating: 4.8,
    travelers: 1650,
    highlights: ["Rio da Prata", "Gruta Azul", "Aquário Natural"],
    ecosystem: "Cerrado/Aquático",
    wildlife: 450,
    conservation: "Municipal",
  },
  {
    id: 6,
    name: "Mata Atlântica - Ilhabela",
    state: "São Paulo",
    description:
      "Hotspot de biodiversidade com trilhas e cachoeiras preservadas",
    duration: "2-5 dias",
    budget: "R$ 1.500 - R$ 4.000",
    rating: 4.6,
    travelers: 1420,
    highlights: ["Trilhas Ecológicas", "Cachoeiras", "Aves Endêmicas"],
    ecosystem: "Mata Atlântica",
    wildlife: 380,
    conservation: "Estadual",
  },
  {
    id: 7,
    name: "Lençóis Maranhenses",
    state: "Maranhão",
    description: "Dunas brancas e lagoas azuis em paisagem única no mundo",
    duration: "3-5 dias",
    budget: "R$ 1.800 - R$ 3.800",
    rating: 4.7,
    travelers: 1320,
    highlights: ["Lagoa Bonita", "Lagoa Azul", "Dunas Brancas"],
    ecosystem: "Costeiro/Dunas",
    wildlife: 180,
    conservation: "Nacional",
  },
  {
    id: 8,
    name: "Chapada dos Guimarães",
    state: "Mato Grosso",
    description:
      "Portal de entrada do Pantanal com formações rochosas espetaculares",
    duration: "3-5 dias",
    budget: "R$ 1.000 - R$ 2.800",
    rating: 4.5,
    travelers: 1150,
    highlights: ["Portão do Inferno", "Véu de Noiva", "Cidade de Pedra"],
    ecosystem: "Cerrado",
    wildlife: 290,
    conservation: "Nacional",
  },
];

export default function NaturezaPage() {
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
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Leaf className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Destinos de <span className="font-normal">Natureza</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Ecoturismo, vida selvagem e paisagens preservadas. Conecte-se com a
            natureza em alguns dos ecossistemas mais ricos e diversos do
            planeta.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="rounded-xl">
            Todos (20)
          </Button>
          <Button variant="outline" className="rounded-xl">
            UNESCO (6)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Amazônia (4)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Cerrado (8)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Mata Atlântica (5)
          </Button>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {natureDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/explore/destination/${destination.id}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-emerald-200 to-green-500 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {destination.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white rounded-full px-3 py-1">
                    <span className="text-xs font-medium">
                      {destination.conservation}
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
                      <span>🌿 {destination.ecosystem}</span>
                      <span>🦋 {destination.wildlife} esp.</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {destination.highlights
                        .slice(0, 2)
                        .map((highlight, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
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
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-12">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Apaixonado pela natureza?
          </h3>
          <p className="text-gray-600 font-light mb-8">
            Nossa IA pode criar roteiros ecológicos com foco na conservação e
            experiências sustentáveis
          </p>
          <Link href="/planner">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl">
              Criar Roteiro Ecológico
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
