"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { useUser } from "@/hooks/use-supabase-user";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function AlbumsPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?callback=/albums");
      return;
    }

    const fetchAlbums = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('albums')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setAlbums(data || []);
        } catch (error) {
          console.error("Error fetching albums:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAlbums();
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-32 bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <header className="mb-20 text-center space-y-4">
          <div className="inline-block p-3 rounded-full bg-accent/10 border border-accent/20 mb-4 animate-bounce">
            <Camera className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold accent-glow tracking-tight uppercase">
            Album Kenangan
          </h1>
          <p className="text-muted-foreground text-xl font-light">
            Klik pada album untuk mengunduh semua memori indah di link Drive
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
            <p className="text-muted-foreground animate-pulse">Menghubungkan ke Album...</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-muted-foreground text-lg italic">Belum ada album yang dibagikan saat ini.</p>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {albums.map((album) => (
                <CarouselItem key={album.id} className="pl-4 basis-full md:basis-1/2 lg:basis-2/3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden group cursor-pointer border border-white/10 shadow-2xl transition-all duration-500 hover:border-accent/40">
                        <Image
                          src={album.image_url}
                          alt={album.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                          <h3 className="text-3xl md:text-4xl font-headline font-bold text-white mb-2 uppercase tracking-wide">
                            {album.title}
                          </h3>
                          <p className="text-accent text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             Buka Folder Kenangan
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>

                    <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-white/10 p-8 rounded-[2rem] text-center space-y-6">
                      <DialogTitle className="text-3xl font-headline font-bold text-accent uppercase tracking-wider">
                        Unduh Album
                      </DialogTitle>
                      <DialogDescription className="text-lg text-muted-foreground">
                        Satu klik untuk mengunduh semua momen berharga di album <strong>"{album.title}"</strong>.
                      </DialogDescription>
                      
                      <div className="py-4">
                        <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center text-accent border border-accent/20 mb-6">
                           <Download className="w-10 h-10 animate-pulse" />
                        </div>
                        
                        <Button 
                          onClick={() => window.open(album.drive_link, '_blank')}
                          className="w-full h-16 rounded-2xl bg-accent hover:bg-accent/80 text-background font-bold text-lg uppercase tracking-widest group shadow-[0_0_20px_rgba(26,204,230,0.3)] transition-all hover:scale-[1.02]"
                        >
                          <span className="flex items-center gap-3">
                            Unduh album kenangan nya disini
                            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </span>
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-6 mt-12">
              <CarouselPrevious className="relative inset-0 translate-y-0 h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-accent hover:text-background transition-all" />
              <CarouselNext className="relative inset-0 translate-y-0 h-14 w-14 rounded-full border-white/10 bg-white/5 hover:bg-accent hover:text-background transition-all" />
            </div>
          </Carousel>
        )}
      </div>
    </main>
  );
}

export default dynamic(() => Promise.resolve(AlbumsPage), {
  ssr: false
});
