import Link from "next/link";
import { MapPin, Cloud, Utensils } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/beach-paradise.jpg"
            alt="Beach paradise background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-sm text-white/80 drop-shadow-sm mb-8">
              <span>Brasil</span>
              <span>•</span>
              <span>Planejamento de Viagens</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-light text-white drop-shadow-lg mb-8 leading-tight">
              Welcome
              <br />
              <span className="font-normal">Adventure</span>
            </h1>

            <p className="text-xl text-white/90 drop-shadow-sm mb-12 max-w-lg leading-relaxed">
              Criando um jeito inteiramente novo de planejar suas viagens
              favoritas ao redor do mundo.
            </p>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <select className="w-full p-4 border-0 bg-gray-50 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Destino</option>
                    <option>Rio de Janeiro</option>
                    <option>São Paulo</option>
                    <option>Salvador</option>
                  </select>
                </div>
                <div className="relative">
                  <select className="w-full p-4 border-0 bg-gray-50 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Check In — Check Out</option>
                    <option>Este fim de semana</option>
                    <option>Próxima semana</option>
                  </select>
                </div>
                <div className="relative">
                  <select className="w-full p-4 border-0 bg-gray-50 rounded-xl text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Orçamento</option>
                    <option>Até R$ 2.000</option>
                    <option>R$ 2.000 - R$ 6.000</option>
                    <option>R$ 6.000+</option>
                  </select>
                </div>
                <Link href="/planner">
                  <Button className="w-full h-14 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium">
                    Buscar Roteiro
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Minimalista */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Como funciona?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Em 3 passos simples, tenha um roteiro completo e personalizado
              para sua viagem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-8 group-hover:shadow-xl transition-shadow">
                <MapPin className="h-10 w-10 text-teal-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                1. Informe seu destino
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Diga onde está e para onde quer ir, suas datas e orçamento
                disponível
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-8 group-hover:shadow-xl transition-shadow">
                <Cloud className="h-10 w-10 text-teal-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                2. IA analisa tudo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Nossa IA verifica clima, atrações, gastronomia e adapta ao seu
                orçamento
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-8 group-hover:shadow-xl transition-shadow">
                <Utensils className="h-10 w-10 text-teal-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                3. Receba seu roteiro
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Roteiro dia a dia + pratos típicos + receitas + dicas locais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Categories - Clean Design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              Para todos os orçamentos
            </h2>
            <p className="text-lg text-gray-600">
              Sugestões personalizadas para cada faixa de investimento
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Econômico */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-sm font-medium text-teal-600 mb-2">
                  💸 Econômico
                </div>
                <div className="text-3xl font-light text-gray-900 mb-6">
                  até R$ 2.000
                </div>
                <ul className="space-y-3 text-gray-600 text-left">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Hostels e pousadas
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Transporte público
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Comida local acessível
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Atrações gratuitas
                  </li>
                </ul>
              </div>
            </div>

            {/* Confortável */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-sm font-medium text-teal-600 mb-2">
                  🏨 Confortável
                </div>
                <div className="text-3xl font-light text-gray-900 mb-6">
                  R$ 2.000 - R$ 6.000
                </div>
                <ul className="space-y-3 text-gray-600 text-left">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Hotéis 3 estrelas
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Mix de transporte
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Restaurantes locais
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Experiências culturais
                  </li>
                </ul>
              </div>
            </div>

            {/* Premium */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="text-sm font-medium text-teal-600 mb-2">
                  ✨ Premium
                </div>
                <div className="text-3xl font-light text-gray-900 mb-6">
                  R$ 6.000+
                </div>
                <ul className="space-y-3 text-gray-600 text-left">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Hotéis 4-5 estrelas
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Transfers privados
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Experiências gastronômicas
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></span>
                    Tours exclusivos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-light mb-6">
              Pronto para sua próxima aventura?
            </h2>
            <p className="text-xl mb-8 opacity-90 font-light">
              Junte-se a milhares de viajantes que já descobriram destinos
              incríveis
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link href="/planner">
                <Button className="w-full bg-white text-teal-600 hover:bg-gray-100 rounded-xl px-8 py-4 font-medium">
                  Começar Agora - Grátis
                </Button>
              </Link>
              <Link href="/examples">
                <Button className="w-full border-2 border-white text-white hover:bg-white hover:text-teal-600 rounded-xl px-8 py-4 font-medium bg-transparent">
                  Ver Exemplos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T&T</span>
                </div>
                <span className="text-xl font-light">Taste & Trip</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Planeje viagens incríveis com inteligência artificial. Roteiros
                personalizados, clima em tempo real e gastronomia local.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-6">Produto</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/planner"
                    className="hover:text-white transition-colors"
                  >
                    Criar Roteiro
                  </Link>
                </li>
                <li>
                  <Link
                    href="/examples"
                    className="hover:text-white transition-colors"
                  >
                    Exemplos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Preços
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-6">Suporte</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Ajuda
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contato
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Taste & Trip. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
