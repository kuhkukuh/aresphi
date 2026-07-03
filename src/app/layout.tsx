import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'sonner';
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
      <head>
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body className="min-h-screen flex flex-col bg-beige text-stone-900 font-sans overflow-x-hidden selection:bg-orange selection:text-white">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: 'group flex items-center gap-3 w-auto max-w-md px-4 py-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl shadow-stone-900/10',
              title: 'text-sm font-medium text-stone-900',
              description: 'text-sm text-stone-500',
              icon: 'flex-shrink-0 w-5 h-5 text-orange',
              success: 'text-orange',
              error: 'text-red-500',
              info: 'text-blue-500',
              closeButton: 'right-1 top-1/2 -translate-y-1/2 left-auto bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 text-stone-500 hover:text-stone-700',
            },
          }}
        />
      </body>
    </html>
  );
}
