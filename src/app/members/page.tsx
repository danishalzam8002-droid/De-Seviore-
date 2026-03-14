
"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Phone, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const members = [
  {
    id: 1,
    name: "Ahmad Zaidan",
    pob: "Jakarta",
    dob: "12 April 2005",
    phone: "0812-3456-7890",
    ig: "@ahmadzdn",
    quote: "Kegagalan hanyalah tempat istirahat untuk kesuksesan berikutnya.",
    image: PlaceHolderImages.find(img => img.id === 'member-1')?.imageUrl
  },
  {
    id: 2,
    name: "Siti Rahma",
    pob: "Bandung",
    dob: "22 Agustus 2005",
    phone: "0821-4455-6677",
    ig: "@sitira_hma",
    quote: "Kebaikan tidak membutuhkan biaya tapi sangat berarti bagi segalanya.",
    image: PlaceHolderImages.find(img => img.id === 'member-2')?.imageUrl
  },
  {
    id: 3,
    name: "Budi Santoso",
    pob: "Surabaya",
    dob: "05 Desember 2004",
    phone: "0856-1122-3344",
    ig: "@budi_san",
    quote: "Kode itu seperti humor. Kalau harus dijelaskan, berarti buruk.",
    image: PlaceHolderImages.find(img => img.id === 'member-3')?.imageUrl
  },
  {
    id: 4,
    name: "Diana Putri",
    pob: "Medan",
    dob: "30 Januari 2005",
    phone: "0877-8899-0011",
    ig: "@diana_ptr",
    quote: "Bermimpilah besar, bekerja keras, tetap rendah hati.",
    image: PlaceHolderImages.find(img => img.id === 'member-4')?.imageUrl
  }
];

export default function MembersPage() {
  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 overflow-hidden">
        <header className="mb-16 text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-headline font-bold accent-glow">
            Biografi Anggota
          </h1>
          <p className="text-muted-foreground text-xl">Kenali wajah-wajah De'Seviore</p>
        </header>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {members.map((member) => (
              <CarouselItem key={member.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="glass-card overflow-hidden group h-full">
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src={member.image || "https://picsum.photos/seed/default/400/500"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <h3 className="text-3xl font-headline font-bold mb-1">{member.name}</h3>
                      <Badge variant="outline" className="border-accent text-accent">Siswa</Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{member.pob}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{member.dob}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 text-accent" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Instagram className="w-4 h-4 text-accent" />
                        <span>{member.ig}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <p className="italic text-lg text-foreground/90 font-light leading-relaxed">
                        "{member.quote}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-12">
            <CarouselPrevious className="relative inset-0 translate-y-0 h-12 w-12 border-white/10 hover:bg-white/5" />
            <CarouselNext className="relative inset-0 translate-y-0 h-12 w-12 border-white/10 hover:bg-white/5" />
          </div>
        </Carousel>
      </div>
    </main>
  );
}
