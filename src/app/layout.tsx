
import type { Metadata } from 'next';
import { Playfair_Display, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import dynamic from 'next/dynamic';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: "De Seviore - Website Resmi Angkatan",
  description: "Sejarah, Filosofi, dan Warisan angkatan kami. Powered by Al-Azhar Seventh Generation.",
  openGraph: {
    title: "De Seviore - Website Resmi Angkatan",
    description: "Sejarah, Filosofi, dan Warisan angkatan kami.",
    url: "https://deseviore.vercel.app",
    siteName: "De Seviore",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "De Seviore - Website Resmi Angkatan",
    description: "Sejarah, Filosofi, dan Warisan angkatan kami.",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import { KakViorBotClient } from "@/components/KakViorBotClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className={`${playfair.variable} ${ptSans.variable} font-body antialiased bg-background text-foreground min-h-screen`}>
        {children}
        <KakViorBotClient />
        <Toaster />
      </body>
    </html>
  );
}
