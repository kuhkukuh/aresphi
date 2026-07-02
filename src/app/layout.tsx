import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { SmoothScrollProvider } from '@/lib/smooth-scroll';
import Navigation from '@/components/Navigation';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aresphi Property - Partner Terpercaya untuk Properti Anda',
  description: 'Aresphi Property menyediakan layanan jual-beli, sewa, konsultasi, pemasaran, dan pendampingan transaksi properti.',
  keywords: ['properti', 'broker', 'jual beli', 'sewa', 'investasi properti', 'Aresphi'],
  authors: [{ name: 'Aresphi Property' }],
  openGraph: {
    title: 'Aresphi Property - Partner Terpercaya untuk Properti Anda',
    description: 'Aresphi Property menyediakan layanan jual-beli, sewa, konsultasi, pemasaran, dan pendampingan transaksi properti.',
    type: 'website',
    locale: 'id_ID',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
        <SmoothScrollProvider>
          <Navigation />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
