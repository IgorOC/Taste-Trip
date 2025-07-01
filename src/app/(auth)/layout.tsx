import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Simple Header for Auth Pages */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T&T</span>
            </div>
            <span className="text-xl font-light text-gray-900">
              Taste & Trip
            </span>
          </Link>
        </div>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">{children}</div>
      </main>
    </div>
  );
}
