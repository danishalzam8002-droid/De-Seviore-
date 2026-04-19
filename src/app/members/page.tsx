"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Phone, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, optimizeCloudinary } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
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
                        {/* Subtle bottom shadow for name readability */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
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

                  <DialogContent className="max-w-5xl h-[90vh] md:h-[650px] p-1 overflow-hidden bg-transparent border-none shadow-none">
                    <DialogTitle className="sr-only">Biografi {member.name}</DialogTitle>
                    <DialogDescription className="sr-only">Detail profil {member.name}</DialogDescription>
                    
                    <div className="liquid-glass-container w-full h-full">
                      <div className="liquid-glass-content flex flex-col md:flex-row h-full">
                        {/* Left: Full Image */}
                        <div className="relative w-full md:w-1/2 h-64 md:h-full overflow-hidden">
                          <Image
                            src={optimizeCloudinary(member.imageUrl || member.image_url || "https://picsum.photos/seed/default/400/500", 1200)}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                          {/* Subtle shadow for name readability on mobile */}
                          <div className="absolute inset-x-0 bottom-0 h-1/2 md:hidden bg-gradient-to-t from-black/80 to-transparent" />
                        </div>

                        {/* Right: Content */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 md:overflow-y-auto flex flex-col justify-center space-y-8 relative bg-card/40 backdrop-blur-xl">
                          {/* Atmospheric Background Blobs */}
                          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                            <motion.div 
                              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[60px]"
                            />
                            <motion.div 
                              animate={{ x: [0, -20, 0], y: [0, 40, 0] }}
                              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute bottom-[0%] -right-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[50px]"
                            />
                          </div>

                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4 relative"
                          >
                            <div className="space-y-1">
                              <h2 className="text-4xl md:text-5xl font-headline font-bold accent-glow tracking-tight text-white">{member.name}</h2>
                              <div className="h-1 w-20 bg-accent/50 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ x: "-100%" }}
                                  animate={{ x: "100%" }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="h-full w-full bg-accent"
                                />
                              </div>
                            </div>
                            <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-widest">
                              {member.role || "Anggota"}
                            </Badge>
                          </motion.div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative">
                            {[
                              { label: "Asal", value: member.pob, icon: MapPin },
                              { label: "Lahir", value: member.dob, icon: Calendar },
                              { label: "Kontak", value: member.phone, icon: Phone },
                              { label: "IG", value: member.ig, icon: Instagram, prefix: "@" }
                            ].map((item, idx) => (
                              <motion.div 
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                                className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                              >
                                <div className="p-2.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                                  <item.icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{item.label}</span>
                                  <span className="text-sm font-semibold text-white/90">
                                    {item.prefix}{item.value || "-"}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="pt-8 border-t border-white/5 relative"
                          >
                            <div className="relative p-6 rounded-3xl bg-accent/5 border border-accent/20 overflow-hidden">
                              <QuoteIcon className="absolute -top-2 -left-2 w-12 h-12 text-accent/10 -rotate-12" />
                              <p className="text-xl md:text-2xl font-headline italic font-light leading-relaxed text-white/90 relative z-10 text-center">
                                {member.quote || "Bangga menjadi bagian dari De Seviore."}
                              </p>
                              <QuoteIcon className="absolute -bottom-2 -right-2 w-12 h-12 text-accent/10 rotate-12" />
                            </div>
                          </motion.div>
                        </div>
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
