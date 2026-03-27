'use client';

import Image from 'next/image';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Theme Toggle - Floating in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8 fade-in">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="rounded-2xl"
            />
          </div>
          <h1 className="text-hero font-bold tracking-tighter mb-6 fade-in">
            Vote with a Simple Scan
          </h1>
          <p className="text-lg text-secondary mb-12 max-w-2xl mx-auto fade-in">
            Modern QR code-based voting system. Scan, vote, and see results update in real-time.
          </p>

          <div className="flex gap-4 justify-center fade-in">
            <a href="/admin/login" className="btn-primary">
              Admin Dashboard
            </a>
            <a href="#how-it-works" className="btn-secondary">
              Learn More
            </a>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <p className="section-label mb-8 text-center">HOW IT WORKS</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card slide-up">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
              <p className="text-secondary text-sm">
                Each project has a unique QR code. Simply scan it with your phone camera.
              </p>
            </div>

            <div className="card slide-up" style={{ animationDelay: '100ms' }}>
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Cast Your Vote</h3>
              <p className="text-secondary text-sm">
                One tap to vote. Duplicate votes are automatically prevented.
              </p>
            </div>

            <div className="card slide-up" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Live Results</h3>
              <p className="text-secondary text-sm">
                Watch votes update in real-time. Transparent and instant results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-secondary">
            Built with Next.js, NestJS, and Supabase
          </p>
        </div>
      </footer>
    </div>
  );
}
