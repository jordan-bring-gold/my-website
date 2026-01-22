
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '../lib/utils';
import { Toaster } from '../components/ui/toaster';
import Header from '../components/header';
import Footer from '../components/footer';
import { Inter, Source_Code_Pro } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({ 
  subsets: ['latin'],
  variable: '--font-source-code-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Jordan Bringgold',
  description: 'A personal brand website showcasing my experience and work.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sourceCodePro.variable}`}>
      <body className={cn('min-h-screen font-body antialiased flex flex-col')}>
        
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        
      </body>
    </html>
  );
}
