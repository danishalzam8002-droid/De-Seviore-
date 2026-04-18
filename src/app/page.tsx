
"use client";

import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, History, Shield, Camera, Play, Star, Sparkles, Heart, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useUser } from "@/hooks/use-supabase-user";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

export default function Home() {
  const { user } = useUser();
  const [batchInfo, setBatchInfo] = useState({
    history: "Lahir dari mimpi bersama, De Seviore dengan cepat berkembang menjadi komunitas pemikir dan pencipta yang dinamis. Didirikan pada tahun 2021, angkatan kami telah melewati berbagai tantangan, mengubahnya menjadi tonggak pertumbuhan dan persahabatan.",
    philosophy: 'Nama De Seviore melambangkan "Pelayan Kebijaksanaan." Kami percaya bahwa kepemimpinan sejati berakar pada pengabdian dan bahwa pengetahuan hanya berharga jika dibagikan.'
  });
  const [gallery, setGallery] = useState<any[]>([]);
  const logo = PlaceHolderImages.find(img => img.id === 'batch-logo');
  const bgImages = [
    "/backgrounds/bg-1.png",
    "/backgrounds/bg-3.png",
    "/backgrounds/bg-4.png",
    "/backgrounds/bg-5.png"
  ];
  const [currentBg, setCurrentBg] = useState(0);
  const videos = [
    { id: 1, url: "https://www.youtube.com/embed/ZVAhEWgkl1g?autoplay=1&mute=1&enablejsapi=1" },
    { id: 2, url: "https://www.youtube.com/embed/PwHkXYqXN1A?autoplay=1&mute=1&enablejsapi=1" }
  ];

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const [videoCarouselApi, setVideoCarouselApi] = useState<CarouselApi>();

  // Mouse tracking for Registration Section
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const [isHovering, setIsHovering] = useState(false);
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([]);
  const [logoStars, setLogoStars] = useState<{ id: number; x: number; y: number; tx: number; ty: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);

    // Add a new star occasionally for performance
    if (Math.random() > 0.7) {
      const newStar = {
        id: Date.now(),
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
      };
      setStars((prev) => [...prev.slice(-20), newStar]); // Keep only last 20 stars
    }
  };

  const handleLogoClick = () => {
    const newStars = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      tx: (Math.random() - 0.5) * 300,
      ty: (Math.random() - 0.5) * 300,
    }));
    setLogoStars((prev) => [...prev.slice(-16), ...newStars]);
  };

  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 8000);
    return () => clearInterval(bgTimer);
  }, []);

  useEffect(() => {
    const fetchBatchInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('batch_info')
          .select('*')
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Ignore "no rows returned" error
            console.error("Error fetching batch info:", error);
          }
          return;
        }
        
        if (data) {
          setBatchInfo(data as any);
        }
      } catch (error) {
        console.error("Error fetching batch info:", error);
      }
    };
    
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setGallery(data || []);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };

    fetchBatchInfo();
    fetchGallery();
  }, []);

  useEffect(() => {
    if (!videoCarouselApi) return;

    videoCarouselApi.on("select", () => {
      // Pause all youtube iframes when sliding
      const iframes = document.querySelectorAll(".video-iframe");
      iframes.forEach((iframe) => {
        if (iframe instanceof HTMLIFrameElement && iframe.contentWindow) {
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      });
      
      // Auto-play the currently active slide's video
      const activeIndex = videoCarouselApi.selectedScrollSnap();
      const activeIframe = iframes[activeIndex];
      if (activeIframe instanceof HTMLIFrameElement && activeIframe.contentWindow) {
        activeIframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    });
  }, [videoCarouselApi]);

  return (
    <main className="pb-40 md:pb-32 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBg}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.35, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ 
                opacity: { duration: 2 },
                scale: { duration: 8, ease: "linear" }
              }}
              className="absolute inset-0"
            >
              <Image
                src={bgImages[currentBg]}
                alt={`Hero Background ${currentBg + 1}`}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 text-center px-6 space-y-2"
        >
          {logo && (
            <motion.div 
              initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
              animate={{ 
                rotate: [0, -1.5, 1.5, 0],
                y: [0, -15, 0],
                opacity: 1, 
                scale: 1 
              }}
              whileHover={{ 
                scale: 1.08,
                rotate: [0, -3, 3, -2, 2, 0],
                transition: {
                  rotate: {
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "easeInOut"
                  }
                }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogoClick}
              transition={{ 
                delay: 0.3, 
                duration: 1.5,
                y: {
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }
              }}
              className="mx-auto w-40 h-40 md:w-64 md:h-64 relative mb-2 cursor-pointer group"
            >
              <Image
                src={logo.imageUrl}
                alt="Logo De Seviore"
                fill
                className="object-contain drop-shadow-[0_0_25px_rgba(26,204,230,0.4)] transition-all duration-700 group-hover:drop-shadow-[0_0_45px_rgba(26,204,230,0.6)]"
              />
              
              {/* Explosion Stars on Click */}
              <AnimatePresence>
                {logoStars.map((star) => (
                  <motion.div
                    key={star.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ 
                      x: star.tx, 
                      y: star.ty, 
                      opacity: 0, 
                      scale: 0,
                      rotate: 360 
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-yellow-400"
                  >
                    <Star size={16} fill="currentColor" className="drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Smooth floating particles on hover */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 left-1/4 w-1.5 h-1.5 bg-accent/60 rounded-full blur-[1px]" />
                <div className="absolute bottom-1/4 right-0 w-2 h-2 bg-blue-400/60 rounded-full blur-[2px]" />
              </motion.div>
            </motion.div>
          )}
          <h1 className="font-headline font-bold accent-glow tracking-tight flex flex-col items-center gap-2">
            <motion.span 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-2xl md:text-5xl font-normal opacity-90"
            >
              {user ? `Halo ${(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin').replace(/[0-9]/g, '')}, Selamat datang di` : 'Selamat datang di'}
            </motion.span>
            <motion.span 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-5xl md:text-8xl"
            >
              Seviore Space
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-light italic mt-4"
          >
            Powered by : "Al-Azhar Seventh Generation"
          </motion.p>
        </motion.div>
      </section>

      {/* History & Philosophy */}
      <section className="container mx-auto px-6 pb-6 pt-12 md:pt-20 grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="glass-card h-full">
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 text-accent mb-4">
                <History className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-headline font-bold">Sejarah Kami</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                {batchInfo.history}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="glass-card h-full">
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 text-accent mb-4">
                <Shield className="w-8 h-8" />
                <h2 className="text-2xl md:text-3xl font-headline font-bold">Filosofi</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                {batchInfo.philosophy}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* School Affiliation */}
      <section className="container mx-auto px-6 py-6 md:py-12 flex justify-center">
        <div className="glass-card flex flex-col items-center justify-center space-y-4 px-8 md:px-10 py-8 rounded-3xl w-full md:w-fit shadow-xl border border-white/5 bg-background/30 backdrop-blur-md overflow-hidden">
          <p className="text-lg md:text-2xl font-bold text-muted-foreground/80 capitalize tracking-widest text-center">
            Student Of :
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            {/* Logo Pondok (Kiri) */}
            <div className="relative w-20 h-20 md:w-32 md:h-32 opacity-90 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/school-logo.png"
                alt="School Logo"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>

            {/* Logo Yayasan (Tengah) */}
            <div className="relative w-20 h-20 md:w-32 md:h-32 opacity-90 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/logo-yayasan.jpg"
                alt="Logo Yayasan"
                fill
                className="object-contain drop-shadow-lg rounded-xl"
              />
            </div>
            
            {/* Logo MA (Kanan) */}
            <div className="relative w-20 h-20 md:w-32 md:h-32 opacity-90 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/logo-ma.png"
                alt="Logo MA"
                fill
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA Section */}
      <section 
        className="container mx-auto px-6 py-12 md:py-20"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass-card overflow-hidden rounded-[2rem] md:rounded-[3rem] p-1 shadow-2xl group/cta"
        >
          {/* Enhanced Rainbow Shine Effect (Natural Glow + Stars) */}
          <AnimatePresence>
            {isHovering && (
              <>
                <motion.div 
                  className="absolute z-30 pointer-events-none md:block hidden"
                  style={{
                    left: springX,
                    top: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <div className="w-[400px] h-[300px] bg-[conic-gradient(from_0deg,transparent_0deg,violet_60deg,indigo_120deg,blue_180deg,green_240deg,yellow_300deg,orange_360deg)] opacity-20 blur-[80px] animate-[spin_6s_linear_infinite]" />
                </motion.div>

                {/* Sparkling Star Trail */}
                {stars.map((star) => (
                  <motion.div
                    key={star.id}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ opacity: [0, 1, 0.5, 0], scale: [0, 1, 0.8, 0], rotate: 180 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute z-40 pointer-events-none text-yellow-400/80 md:block hidden"
                    style={{ left: star.x, top: star.y, translateX: "-50%", translateY: "-50%" }}
                  >
                    <Star size={Math.random() * 12 + 6} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-blue-500/10 opacity-50" />
          <div className="relative z-10 bg-background/40 backdrop-blur-xl rounded-[1.9rem] md:rounded-[2.9rem] p-8 md:p-16 text-center space-y-8 border border-white/10">
            <div className="flex justify-center gap-4 mb-4">
               <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="p-2 md:p-3 bg-yellow-500/20 rounded-2xl text-yellow-500"><Star /></motion.div>
               <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="p-2 md:p-3 bg-accent/20 rounded-2xl text-accent"><Sparkles /></motion.div>
               <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="p-2 md:p-3 bg-emerald-500/20 rounded-2xl text-emerald-500"><Heart /></motion.div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl md:text-6xl font-headline font-bold accent-glow leading-tight">
                Ayo Jadi Bagian <br className="hidden md:block"/> dari Keluarga Al-Azhar! ✨
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                Pendaftaran santri baru sudah dibuka lho Akang & Teteh! Yuk, bergabung dengan ribuan santri lainnya untuk mencetak generasi Rabbani yang unggul. 🎓
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {["Pondok Pesantren", "SDIT Al-Azhar", "SMP Islam Al-Azhar", "MA Unggulan Al-Azhar"].map((unit, idx) => (
                <div key={idx} className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10 bg-white/5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/70">
                  {unit}
                </div>
              ))}
            </div>

            <div className="pt-4 md:pt-8">
               <Button size="lg" className="h-14 md:h-16 px-8 md:px-12 rounded-2xl bg-accent text-background hover:bg-accent/90 shadow-xl shadow-accent/20 hover:scale-105 transition-all text-lg md:text-xl font-bold gap-3 w-full md:w-auto" asChild>
                <Link href="/alazhar/info-pendaftaran">
                   LIHAT INFO PENDAFTARAN ✨ <Send size={24} />
                </Link>
              </Button>
              <p className="mt-6 text-xs md:text-sm text-muted-foreground italic">
                * Buka link di atas untuk rincian biaya & kontak person admin yang ramah! 😊
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Video Trailer Section */}
      <section className="container mx-auto px-6 pb-12 md:pb-20 pt-6">
        <div className="glass-card rounded-2xl overflow-hidden p-1 md:p-4">
          <div className="flex items-center gap-3 text-accent mb-6 md:mb-8 p-4">
            <Play className="w-8 h-8 fill-accent" />
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Kegiatan Kami</h2>
          </div>
          <Carousel 
            setApi={setVideoCarouselApi}
            plugins={[plugin.current]} 
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {videos.map((video) => (
                <CarouselItem key={video.id}>
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-white/5">
                    <iframe
                      src={video.url}
                      title={`Video Kegiatan ${video.id}`}
                      className="video-iframe absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Absolute positioned glass buttons */}
            <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-white hover:bg-white/20 hover:text-white transition-all z-10" />
            <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-white hover:bg-white/20 hover:text-white transition-all z-10" />
          </Carousel>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-6 py-12 md:py-20">
        <div className="flex items-center gap-3 text-accent mb-8 md:mb-12">
          <Camera className="w-8 h-8" />
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Swipe The Moment!!</h2>
        </div>
        
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {gallery.length > 0 ? gallery.map((item) => (
              <CarouselItem key={item.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="liquid-glass-container group h-64 md:h-80 transition-all duration-500 hover:scale-[1.02]">
                  <div className="liquid-glass-content">
                    <Image
                      src={item.image_url}
                      alt="Gallery Moment"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-5 md:p-6 pb-8">
                      <motion.div 
                        initial={{ y: 15, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-2"
                      >
                        <p className="text-white font-bold text-lg md:text-xl tracking-tight bg-accent/30 backdrop-blur-2xl px-4 py-2 rounded-xl italic shadow-2xl inline-block w-fit">
                          #{item.title || "SevioreMoment"}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )) : (
              [1, 2, 3].map((i) => (
                <CarouselItem key={i} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="liquid-glass-container h-64 md:h-80 opacity-50">
                    <div className="liquid-glass-content flex items-center justify-center">
                      <Camera className="w-10 h-10 text-white/10 animate-pulse" />
                    </div>
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="relative inset-0 translate-y-0 h-10 w-10 border-white/10" />
            <CarouselNext className="relative inset-0 translate-y-0 h-10 w-10 border-white/10" />
          </div>

          {/* Link to Albums Page - Restricted to Admins */}
          {user && (
            <div className="mt-10 md:mt-12 text-center animate-in fade-in zoom-in duration-700 delay-300">
              <a 
                href="/albums" 
                className="group inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-all duration-300"
              >
                <div className="p-3 rounded-full border border-white/10 bg-white/5 group-hover:border-accent/30 group-hover:bg-accent/5">
                  <Camera className="w-5 h-5 text-accent" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">
                  Lihat Album Kenangan
                </span>
              </a>
            </div>
          )}
        </Carousel>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <Quote className="w-8 md:w-12 h-8 md:h-12 text-accent mx-auto mb-6 md:mb-8 opacity-50" />
          <blockquote className="text-2xl md:text-5xl font-headline font-italic leading-tight max-w-4xl mx-auto px-4">
            "Kelas bukan sekadar tempat belajar; ini adalah keluarga tempat kamu menemukan jati dirimu."
          </blockquote>
        </div>
      </section>

      {/* Footer Address */}
      <footer className="py-8 bg-background border-t border-white/5 text-center mt-auto pb-48 md:pb-40">
        <a 
          href="https://share.google/HFMJYuzcjlPPYzcM1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-accent transition-colors duration-300 flex flex-col items-center justify-center gap-2"
        >
          <span className="text-sm font-semibold tracking-wide uppercase text-center px-4">Pondok Pesantren Al-Azhar Plered Purwakarta</span>
          <span className="text-xs text-muted-foreground max-w-sm text-center px-4">Gang Coklat, Kp. Warungkandang RT.19/RW.04, Ds. Sindangsari, Kec. Plered, Kabupaten Purwakarta, Jawa Barat</span>
          <span className="text-xs opacity-70 mt-2 hover:underline">Lihat di Google Maps</span>
        </a>
      </footer>
    </main>
  );
}
