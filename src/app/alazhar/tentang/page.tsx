"use client";

import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Newspaper } from "lucide-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

export default function TentangAlAzharPage() {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const newsSlides = [
    {
      id: 1,
      title: "Penerimaan Santri Baru Telah Dibuka",
      date: "14 Maret 2026",
      desc: "Pondok Pesantren Al-Azhar kini membuka pendaftaran gelombang pertama untuk santri baru tahun ajaran depan. Kuota terbatas!",
      imageUrl: "https://picsum.photos/seed/news1/800/600",
      category: "Info Utama"
    },
    {
      id: 2,
      title: "Prestasi Santri De Seviore",
      date: "05 Maret 2026",
      desc: "Selamat kepada perwakilan De Seviore yang telah memenangkan juara pertama dalam Musabaqah Qira'atil Kutub tingkat provinsi.",
      imageUrl: "https://picsum.photos/seed/news2/800/600",
      category: "Prestasi"
    },
    {
      id: 3,
      title: "Kegiatan Ekstrakurikuler Memanah",
      date: "28 Februari 2026",
      desc: "Ekstrakurikuler memanah perdana di semester ini berlangsung meriah. Santri sangat antusias melatih ketangkasan dan fokus.",
      imageUrl: "https://picsum.photos/seed/news3/800/600",
      category: "Kegiatan"
    }
  ];

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 pt-32">
        <header className="mb-12 flex items-center gap-4 border-b border-white/10 pb-6">
          <Newspaper className="w-10 h-10 text-accent" />
          <div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold accent-glow">Tentang Al-Azhar</h1>
            <p className="text-muted-foreground mt-2">Berita, Informasi, dan Sorotan Kegiatan Kami.</p>
          </div>
        </header>

        <section className="relative w-full max-w-5xl mx-auto">
          <Carousel 
            plugins={[plugin.current]} 
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {newsSlides.map((news) => (
                <CarouselItem key={news.id}>
                  <Card className="glass-card overflow-hidden border-white/10 border mx-2 mb-2">
                    <CardContent className="p-0 flex flex-col md:flex-row h-full md:h-[400px]">
                      <div className="relative w-full md:w-1/2 h-64 md:h-full">
                        <Image
                          src={news.imageUrl}
                          alt={news.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-accent/90 text-background px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {news.category}
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-background/50 backdrop-blur-sm">
                        <span className="text-sm text-accent mb-2 font-mono">{news.date}</span>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-headline leading-tight">{news.title}</h2>
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed flex-grow">
                          {news.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white hover:bg-white/20 transition-all z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white hover:bg-white/20 transition-all z-10 hidden sm:flex" />
          </Carousel>
        </section>

      </div>
    </main>
  );
}
