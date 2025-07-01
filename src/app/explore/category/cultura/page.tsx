import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Star,
  Users,
  Camera,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

const culturalDestinations = [
  {
    id: 1,
    name: "Ouro Preto",
    state: "Minas Gerais",
    description:
      "Patrimônio Mundial da UNESCO com arquitetura barroca preservada",
    duration: "2-4 dias",
    budget: "R$ 600 - R$ 1.800",
    rating: 4.8,
    travelers: 2400,
    highlights: [
      "Igreja São Francisco",
      "Museu da Inconfidência",
      "Casa dos Contos",
    ],
    period: "Séc. XVIII",
    heritage: "UNESCO",
    museums: 12,
  },
  {
    id: 2,
    name: "Pelourinho - Salvador",
    state: "Bahia",
    description: "Centro histórico colorido com rica cultura afro-brasileira",
    duration: "2-5 dias",
    budget: "R$ 800 - R$ 2.500",
    rating: 4.7,
    travelers: 3200,
    highlights: [
      "Igreja do Bonfim",
      "Largo do Pelourinho",
      "Museu Afro-Brasileiro",
    ],
    period: "Séc. XVI-XVIII",
    heritage: "UNESCO",
    museums: 15,
  },
  {
    id: 3,
    name: "Olinda",
    state: "Pernambuco",
    description: "Arte, cultura e carnaval em ladeiras históricas",
    duration: "2-4 dias",
    budget: "R$ 700 - R$ 2.000",
    rating: 4.6,
    travelers: 1800,
    highlights: ["Alto da Sé", "Casa dos Bonecos", "Mercado da Ribeira"],
    period: "Séc. XVI",
    heritage: "UNESCO",
    museums: 8,
  },
  {
    id: 4,
    name: "Paraty",
    state: "Rio de Janeiro",
    description: "Vila colonial entre montanhas e mar com festivais literários",
    duration: "2-4 dias",
    budget: "R$ 900 - R$ 2.800",
    rating: 4.8,
    travelers: 2100,
    highlights: ["Centro Histórico", "Casa da Cultura", "FLIP"],
    period: "Séc. XVII",
    heritage: "UNESCO",
    museums: 6,
  },
  {
    id: 5,
    name: "São Luís",
    state: "Maranhão",
    description: "Atenas brasileira com azulejos portugueses únicos",
    duration: "3-5 dias",
    budget: "R$ 800 - R$ 2.200",
    rating: 4.5,
    travelers: 1450,
    highlights: [
      "Centro Histórico",
      "Casa do Maranhão",
      "Teatro Arthur Azevedo",
    ],
    period: "Séc. XVII",
    heritage: "UNESCO",
    museums: 10,
  },
  {
    id: 6,
    name: "Tiradentes",
    state: "Minas Gerais",
    description: "Charme colonial preservado com gastronomia mineira autêntica",
    duration: "2-3 dias",
    budget: "R$ 700 - R$ 2.000",
    rating: 4.7,
    travelers: 1200,
    highlights: ["Igreja Matriz", "Museu do Padre Toledo", "Maria Fumaça"],
    period: "Séc. XVIII",
    heritage: "Nacional",
    museums: 5,
  },
  {
    id: 7,
    name: "Brasília",
    state: "Distrito Federal",
    description: "Capital modernista com arquitetura única de Oscar Niemeyer",
    duration: "2-4 dias",
    budget: "R$ 800 - R$ 2.400",
    rating: 4.4,
    travelers: 2800,
    highlights: ["Congresso Nacional", "Catedral", "Palácio da Alvorada"],
    period: "Séc. XX",
    heritage: "UNESCO",
    museums: 20,
  },
  {
    id: 8,
    name: "Diamantina",
    state: "Minas Gerais",
    description:
      "Cidade histórica de pedra e cal, berço de Juscelino Kubitschek",
    duration: "2-3 dias",
    budget: "R$ 500 - R$ 1.500",
    rating: 4.6,
    travelers: 950,
    highlights: ["Casa JK", "Igreja do Carmo", "Mercado Velho"],
    period: "Séc. XVIII",
    heritage: "UNESCO",
    museums: 7,
  },
  {
    id: 9,
    name: "Congonhas",
    state: "Minas Gerais",
    description: "Os Profetas de Aleijadinho e arte sacra barroca",
    duration: "1-2 dias",
    budget: "R$ 400 - R$ 1.200",
    rating: 4.5,
    travelers: 800,
    highlights: [
      "Santuário do Bom Jesus",
      "Os 12 Profetas",
      "Passos da Paixão",
    ],
    period: "Séc. XVIII",
    heritage: "UNESCO",
    museums: 3,
  },
  {
    id: 10,
    name: "Recife Antigo",
    state: "Pernambuco",
    description: "Marco Zero e cultura pernambucana com frevo e maracatu",
    duration: "2-4 dias",
    budget: "R$ 700 - R$ 2.100",
    rating: 4.4,
    travelers: 2200,
    highlights: ["Marco Zero", "Kahal Zur Israel", "Paço do Frevo"],
    period: "Séc. XVI-XVII",
    heritage: "Nacional",
    museums: 12,
  },
  {
    id: 11,
    name: "Cachoeira",
    state: "Bahia",
    description: "Berço da nacionalidade com arquitetura colonial preservada",
    duration: "1-3 dias",
    budget: "R$ 500 - R$ 1.400",
    rating: 4.3,
    travelers: 650,
    highlights: [
      "Casa da Câmara",
      "Igreja da Ordem Terceira",
      "Museu Regional",
    ],
    period: "Séc. XVI",
    heritage: "Nacional",
    museums: 4,
  },
  {
    id: 12,
    name: "Goiás Velho",
    state: "Goiás",
    description: "Capital histórica goiana com festivais de arte e cultura",
    duration: "2-3 dias",
    budget: "R$ 600 - R$ 1.600",
    rating: 4.6,
    travelers: 780,
    highlights: [
      "Casa de Cora Coralina",
      "Igreja do Rosário",
      "Museu das Bandeiras",
    ],
    period: "Séc. XVIII",
    heritage: "UNESCO",
    museums: 6,
  },
];

export default function CulturaPage() {
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
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Destinos <span className="font-normal">Culturais</span>
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            História viva, patrimônio preservado e tradições centenárias.
            Mergulhe na rica herança cultural brasileira através de suas cidades
            históricas.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="outline" className="rounded-xl">
            Todos (32)
          </Button>
          <Button variant="outline" className="rounded-xl">
            UNESCO (8)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Colonial (15)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Barroco (12)
          </Button>
          <Button variant="outline" className="rounded-xl">
            Modernista (4)
          </Button>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {culturalDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/explore/destination/${destination.id}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                <div className="relative">
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-200 to-orange-400 flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {destination.rating}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-amber-600 text-white rounded-full px-3 py-1">
                    <span className="text-xs font-medium">
                      {destination.heritage}
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
                      <span>🏛️ {destination.period}</span>
                      <span>🎨 {destination.museums} museus</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {destination.highlights
                        .slice(0, 2)
                        .map((highlight, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"
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
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-12">
          <h3 className="text-2xl font-light text-gray-900 mb-4">
            Interessado em turismo histórico?
          </h3>
          <p className="text-gray-600 font-light mb-8">
            Nossa IA pode criar roteiros culturais personalizados com museus,
            monumentos e tradições locais
          </p>
          <Link href="/planner">
            <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl">
              Criar Roteiro Cultural
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
