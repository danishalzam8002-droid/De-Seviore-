"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExternalLink, FileText, School } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { KakSeviBot } from "@/components/KakSeviBot";

export default function InfoPendaftaranPage() {
  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 pt-32 max-w-4xl">
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 text-accent mb-4">
            <School className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold accent-glow">Info Pendaftaran</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bergabunglah bersama kami di Pondok Pesantren Al-Azhar Purwakarta dan wujudkan generasi Hafidz Berilmu Berakhlak Rabbani.
          </p>
        </header>

        <Card className="glass-card border-white/10 overflow-hidden relative">
          <div className="absolute inset-0 z-0 opacity-10 blur-xl pointer-events-none">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          </div>
          <CardHeader className="text-center relative z-10">
            <CardTitle className="text-2xl font-bold">Pendaftaran Santri Baru</CardTitle>
            <CardDescription className="text-base mt-2">
              Silakan kunjungi situs resmi pendaftaran Pondok Pesantren Al-Azhar Purwakarta untuk mengisi formulir lengkap dan melihat persyaratan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 relative z-10 pb-12">
            <Button size="lg" className="w-full sm:w-auto gap-2 bg-accent text-background hover:bg-accent/90" asChild>
              <Link href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta/registration" target="_blank" rel="noopener noreferrer">
                <ExternalLink size={18} /> Menuju Situs Pendaftaran
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-white/20 hover:bg-white/10" asChild>
              <Link href="/alazhar/tentang">
                <FileText size={18} /> Baca Panduan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <KakSeviBot />
    </main>
  );
}
