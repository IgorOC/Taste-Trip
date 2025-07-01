"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

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

    return () => subscription.unsubscribe();
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
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-700 max-w-[120px] truncate font-medium">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
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
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Minhas Viagens
              </Link>
              <Link
                href="/explore"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Explorar
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
