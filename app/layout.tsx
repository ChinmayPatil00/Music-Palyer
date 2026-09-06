import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export const metadata: Metadata = {
  title: 'WanderX — Adventure Intelligence & Precision Trip Planner',
  description:
    'Discover treks, road trips, bike rides, safaris, hidden destinations and unforgettable experiences — planned around your budget, time and travel style.',
  keywords: [
    'adventure travel',
    'trip planner',
    'budget travel India',
    'Sahyadri treks',
    'Himalayan trekking',
    'overland road trip',
    'bike expedition',
    'jungle safari'
  ],
  authors: [{ name: 'WanderX Team' }],
  openGraph: {
    title: 'WanderX — Adventure Intelligence & Precision Trip Planner',
    description:
      'Plan precision adventure trips fitting your budget: treks, road trips, motorcycle circuits, and wildlife safaris.',
    url: 'https://wanderx.app',
    siteName: 'WanderX',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'WanderX Adventure Planning'
      }
    ],
    locale: 'en_US',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
