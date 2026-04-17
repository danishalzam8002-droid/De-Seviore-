"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Phone, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, optimizeCloudinary } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setMembers(data || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 overflow-hidden">
        <header className="mb-16 text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-headline font-bold accent-glow">
            Intrada Page
          </h1>
          <p className="text-muted-foreground text-xl">Yukk, lebih mengenal dengan guru dan anggota kami</p>
        </header>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {isLoading ? (
               <div className="w-full text-center py-20 text-muted-foreground">Memuat data anggota...</div>
            ) : members.length === 0 ? (
               <div className="w-full text-center py-20 text-muted-foreground">Belum ada anggota yang terdaftar.</div>
            ) : members.map((member) => (
              <CarouselItem key={member.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="glass-card overflow-hidden group h-full cursor-pointer hover:border-accent/50 transition-colors">
                      <div className="relative h-96 overflow-hidden">
                        <Image
                          src={optimizeCloudinary(member.image_url || "https://picsum.photos/seed/default/400/500", 600)}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <h3 className="text-3xl font-headline font-bold mb-1">{member.name}</h3>
                          <Badge variant="outline" className="border-accent text-accent">{member.role || "Anggota"}</Badge>
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
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden glass-card border-white/10 flex flex-col md:flex-row">
                    <DialogTitle className="sr-only">Biografi {member.name}</DialogTitle>
                    <DialogDescription className="sr-only">Detail profil {member.name}</DialogDescription>
                    
                    {/* Left: Full Image */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-full">
                      <Image
                        src={optimizeCloudinary(member.imageUrl || member.image_url || "https://picsum.photos/seed/default/400/500", 1200)}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background to-transparent opacity-80 md:opacity-50" />
                    </div>

                    {/* Right: Content */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 md:overflow-y-auto flex flex-col justify-center space-y-8 relative">
                      <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-headline font-bold accent-glow">{member.name}</h2>
                        <Badge variant="outline" className="border-accent text-accent text-sm">{member.role || "Anggota"}</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3"/> Tempat Lahir</p>
                          <p className="font-semibold">{member.pob}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3 h-3"/> Tanggal Lahir</p>
                          <p className="font-semibold">{member.dob}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs uppercase tracking-widest flex items-center gap-2"><Phone className="w-3 h-3"/> Telepon</p>
                          <p className="font-semibold">{member.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs uppercase tracking-widest flex items-center gap-2"><Instagram className="w-3 h-3"/> Instagram</p>
                          <p className="font-semibold">{member.ig}</p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/10 relative">
                        <p className="text-2xl md:text-3xl font-headline italic font-light leading-relaxed text-foreground/90">
                          "{member.quote}"
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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

export default dynamic(() => Promise.resolve(MembersPage), {
  ssr: false
});
