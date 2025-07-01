// src/app/explore/page.tsx
import Link from "next/link";
import {
  MapPin,
  Users,
  Clock,
  DollarSign,
  Star,
  ArrowRight,
  Compass,
  Camera,

} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Header } from "@/components/layout/Header";

// Dados mockados - em produção viriam de uma API
const featuredDestinations = [
  {
    id: 1,
    name: "Rio de Janeiro",
    image: "/api/placeholder/400/300",
    description:
      "Cristo Redentor, praias de Copacabana e vida noturna vibrante",
    duration: "4-7 dias",
    budget: "R$ 1.500 - R$ 4.000",
    rating: 4.8,
    travelers: 1200,
    category: "cultura",
    highlights: ["Cristo Redentor", "Copacabana", "Santa Teresa"],
  },
  {
    id: 2,
    name: "Gramado",
    image: "/api/placeholder/400/300",
    description: "Arquitetura europeia, chocolate e clima de montanha",
    duration: "3-5 dias",
    budget: "R$ 1.200 - R$ 3.500",
    rating: 4.9,
    travelers: 800,
    category: "montanha",
    highlights: ["Centro Histórico", "Lago Negro", "Vinícolas"],
  },
  {
    id: 3,
    name: "Salvador",
    image: "/api/placeholder/400/300",
    description: "História colonial, praias paradisíacas e culinária baiana",
    duration: "5-8 dias",
    budget: "R$ 1.000 - R$ 3.000",
    rating: 4.7,
    travelers: 950,
    category: "praia",
    highlights: ["Pelourinho", "Praia do Forte", "Mercado Modelo"],
  },
  {
    id: 4,
    name: "Bonito",
    image: "/api/placeholder/400/300",
    description: "Ecoturismo, águas cristalinas e natureza preservada",
    duration: "4-6 dias",
    budget: "R$ 2.000 - R$ 5.000",
    rating: 4.9,
    travelers: 600,
    category: "natureza",
    highlights: ["Gruta Azul", "Rio da Prata", "Aquário Natural"],
  },
];

const categories = [
  {
    id: "praia",
    name: "Praias",
    icon: "🏖️",
    description: "Sol, mar e relaxamento",
    count: 25,
  },
  {
    id: "montanha",
    name: "Montanhas",
    icon: "🏔️",
    description: "Clima frio e paisagens incríveis",
    count: 18,
  },
  {
    id: "cultura",
    name: "Cultura",
    icon: "🏛️",
    description: "História, museus e arquitetura",
    count: 32,
  },
  {
    id: "gastronomia",
    name: "Gastronomia",
    icon: "🍽️",
    description: "Experiências culinárias únicas",
    count: 22,
  },
  {
    id: "aventura",
    name: "Aventura",
    icon: "🚀",
    description: "Esportes radicais e adrenalina",
    count: 15,
  },
  {
    id: "natureza",
    name: "Natureza",
    icon: "🌿",
    description: "Ecoturismo e vida selvagem",
    count: 20,
  },
];

const budgetRanges = [
  {
    title: "Econômico",
    range: "até R$ 2.000",
    description: "Destinos acessíveis sem perder a qualidade",
    destinations: ["Ouro Preto", "Campos do Jordão", "Recife"],
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Confortável",
    range: "R$ 2.000 - R$ 6.000",
    description: "Equilibrio perfeito entre custo e experiência",
    destinations: ["Gramado", "Salvador", "Florianópolis"],
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Premium",
    range: "R$ 6.000+",
    description: "Experiências exclusivas e luxuosas",
    destinations: ["Fernando de Noronha", "Amazônia", "Pantanal"],
    color: "bg-purple-100 text-purple-700",
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-teal-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <Compass className="h-8 w-8 text-teal-600 mr-3" />
                <span className="text-sm font-medium text-teal-600 uppercase tracking-wider">
                  Explorar Destinos
                </span>
              </div>
              <h1 className="text-5xl font-light text-gray-900 mb-6">
                Descubra seu próximo <br />
                <span className="font-normal">destino dos sonhos</span>
              </h1>
              <p className="text-xl text-gray-600 font-light">
                Explore destinos incríveis, inspire-se com roteiros criados por
                outros viajantes e encontre a viagem perfeita para seu estilo e
                orçamento.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
              Explore por categoria
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/explore/category/${category.id}`}
                  className="group"
                >
                  <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="font-medium text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-light mb-2">
                      {category.description}
                    </p>
                    <span className="text-xs text-teal-600 font-medium">
                      {category.count} destinos
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Destinations */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-light text-gray-900">
                Destinos em destaque
              </h2>
              <Link href="/explore/all">
                <Button variant="outline" className="rounded-xl">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredDestinations.map((destination) => (
                <Link
                  key={destination.id}
                  href={`/explore/destination/${destination.id}`}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {destination.rating}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {destination.name}
                      </h3>
                      <p className="text-gray-600 font-light mb-4 line-clamp-2">
                        {destination.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {destination.duration}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            {destination.travelers}
                          </div>
                        </div>

                        <div className="flex items-center text-sm text-teal-600 font-medium">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {destination.budget}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {destination.highlights
                            .slice(0, 2)
                            .map((highlight, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
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
          </div>
        </section>

        {/* Budget Sections */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
              Viaje dentro do seu orçamento
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {budgetRanges.map((budget, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div
                      className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${budget.color}`}
                    >
                      {budget.title}
                    </div>

                    <h3 className="text-2xl font-light text-gray-900 mb-2">
                      {budget.range}
                    </h3>

                    <p className="text-gray-600 font-light mb-6">
                      {budget.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-gray-900">
                        Destinos populares:
                      </h4>
                      {budget.destinations.map((destination, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="text-gray-700">{destination}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/explore/budget/${budget.title.toLowerCase()}`}
                    >
                      <Button variant="outline" className="w-full rounded-xl">
                        Explorar {budget.title}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-teal-600">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-white mb-6">
              Não encontrou o destino ideal?
            </h2>
            <p className="text-xl text-teal-100 font-light mb-8">
              Nossa IA pode criar um roteiro personalizado para qualquer lugar
              do mundo
            </p>
            <Link href="/planner">
              <Button className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-medium">
                Criar Roteiro Personalizado
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
