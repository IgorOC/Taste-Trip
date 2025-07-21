"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {LogOut, Menu, X, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Função para obter o primeiro nome do usuário
  const getUserFirstName = (user: SupabaseUser | null): string => {
    if (!user) return "Usuário";

    // 1. Prioridade: nome completo dos metadados
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0];
    }

    // 2. Nome do provedor (Google, etc.)
    if (user.user_metadata?.name) {
      return user.user_metadata.name.split(" ")[0];
    }

    // 3. Primeiro nome apenas
    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    }

    // 4. Nome do Google (given_name)
    if (user.user_metadata?.given_name) {
      return user.user_metadata.given_name;
    }

    // 5. Fallback: primeira parte do email formatada
    const emailName = user.email?.split("@")[0] || "Usuário";
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  };

  // Função para obter as iniciais do usuário
  const getUserInitials = (user: SupabaseUser | null): string => {
    const name = getUserFirstName(user);
    if (name.length >= 2) {
      return name.substring(0, 2).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Fecha menus quando clica fora
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
      if (!target.closest(".mobile-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
              <span className="text-white font-bold text-sm">T&T</span>
            </div>
            <span className="text-xl font-light text-gray-900">
              Taste & Trip
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Minhas Viagens
            </Link>
            <Link
              href="/explore"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              Explorar
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center">
                  {/* User Menu com Dropdown */}
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getUserInitials(user)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {getUserFirstName(user)}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.user_metadata?.full_name ||
                              getUserFirstName(user)}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircle className="h-4 w-4 mr-3 text-gray-500" />
                          Meu Perfil
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-500" />
                          Configurações
                        </Link>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              handleSignOut();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sair
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile User Info */}
                <div className="sm:hidden">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-8 h-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-medium">
                      {getUserInitials(user)}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl px-4"
                  >
                    Criar Conta
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 mobile-menu-container">
            {user && (
              <div className="px-4 py-3 border-b border-gray-100 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {getUserInitials(user)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name || getUserFirstName(user)}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <nav className="flex flex-col space-y-2 px-4">
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Minhas Viagens
                  </Link>
                  <Link
                    href="/explore"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Explorar
                  </Link>

                  <div className="border-t border-gray-100 my-2 pt-2">
                    <Link
                      href="/profile"
                      className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4 mr-3 text-gray-500" />
                      Meu Perfil
                    </Link>

                    <Link
                      href="/settings"
                      className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3 text-gray-500" />
                      Configurações
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center w-full text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sair
                    </button>
                  </div>
                </>
              )}

              {!user && (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-lg transition-colors font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
