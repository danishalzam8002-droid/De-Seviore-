
"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, History, Shield, Camera, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const logo = PlaceHolderImages.find(img => img.id === 'batch-logo');
  const gallery = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));
  const trailerVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

  return (
    <main className="pb-32">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/hero-bg/1920/1080"
            alt="Hero Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 space-y-6">
          {logo && (
            <div className="mx-auto w-32 h-32 md:w-48 md:h-48 relative mb-8 animate-in fade-in zoom-in duration-1000">
              <Image
                src={logo.imageUrl}
                alt="Logo De'Seviore"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(26,204,230,0.3)]"
              />
            </div>
          )}
          <h1 className="text-5xl md:text-8xl font-headline font-bold accent-glow tracking-tight">
            De'Seviore
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light italic">
            "Warisan Keunggulan, Ikatan Persaudaraan"
          </p>
        </div>
      </section>

      {/* History & Philosophy */}
      <section className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
        <Card className="glass-card">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3 text-accent mb-4">
              <History className="w-8 h-8" />
              <h2 className="text-3xl font-headline font-bold">Sejarah Kami</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Lahir dari mimpi bersama, De'Seviore dengan cepat berkembang menjadi komunitas pemikir dan pencipta yang dinamis. Didirikan pada tahun 2021, angkatan kami telah melewati berbagai tantangan, mengubahnya menjadi tonggak pertumbuhan dan persahabatan.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-center gap-3 text-accent mb-4">
              <Shield className="w-8 h-8" />
              <h2 className="text-3xl font-headline font-bold">Filosofi</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Nama De'Seviore melambangkan "Pelayan Kebijaksanaan." Kami percaya bahwa kepemimpinan sejati berakar pada pengabdian dan bahwa pengetahuan hanya berharga jika dibagikan.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Video Trailer Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="glass-card rounded-2xl overflow-hidden p-1 md:p-4">
          <div className="flex items-center gap-3 text-accent mb-8 p-4">
            <Play className="w-8 h-8 fill-accent" />
            <h2 className="text-4xl font-headline font-bold">Trailer Angkatan</h2>
          </div>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-white/5">
            <iframe
              src={trailerVideoUrl}
              title="De'Seviore Trailer"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-center gap-3 text-accent mb-12">
          <Camera className="w-8 h-8" />
          <h2 className="text-4xl font-headline font-bold">Momen Angkatan</h2>
        </div>
        
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {gallery.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="relative rounded-xl overflow-hidden group h-64 md:h-80">
                  <Image
                    src={item.imageUrl}
                    alt={item.description}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-bold text-lg">{item.description}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="relative inset-0 translate-y-0 h-10 w-10 border-white/10" />
            <CarouselNext className="relative inset-0 translate-y-0 h-10 w-10 border-white/10" />
          </div>
        </Carousel>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <Quote className="w-12 h-12 text-accent mx-auto mb-8 opacity-50" />
          <blockquote className="text-3xl md:text-5xl font-headline font-italic leading-tight max-w-4xl mx-auto">
            "Kelas bukan sekadar tempat belajar; ini adalah keluarga tempat kamu menemukan jati dirimu."
          </blockquote>
        </div>
      </section>
    </main>
  );
}
