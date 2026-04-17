"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Download, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Kitab = {
  id: string;
  title: string;
  author: string;
  category: string;
  file_url: string;
};

export default function PerpustakaanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kitabs, setKitabs] = useState<Kitab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKitabs = async () => {
      try {
        const { data, error } = await supabase
          .from('kitab')
          .select('*')
          .order('title', { ascending: true });
        
        if (error) throw error;
        setKitabs(data || []);
      } catch (error) {
        console.error("Error fetching kitab:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKitabs();
  }, []);

  const filteredKitabs = kitabs.filter((kitab) => 
    kitab.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    kitab.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kitab.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20 pt-32 max-w-5xl">
        <header className="mb-12 flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-accent/10 text-accent mb-4">
            <BookOpen className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold accent-glow">Perpustakaan</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Akses dan pelajari berbagai kitab secara daring. Silakan manfaatkan fasilitas ini untuk menunjang pembelajaran.
          </p>

          <div className="w-full max-w-md mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari judul kitab, jenis, atau penyusun..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-full border-white/20 bg-background/50 backdrop-blur-md"
            />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : filteredKitabs.length === 0 ? (
          <div className="text-center py-20 bg-background/30 rounded-2xl glass-card border border-white/10">
            <p className="text-muted-foreground text-lg">Tidak ada kitab yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredKitabs.map((kitab, index) => (
              <motion.div
                key={kitab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(26, 204, 230, 0.15)"
                }}
              >
                <Card className="glass-card h-full border-white/10 hover:border-accent/50 transition-colors duration-300 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col h-full relative z-10">
                    <div className="mb-4">
                      <span className="inline-block px-2 py-1 bg-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm mb-3">
                        {kitab.category}
                      </span>
                      <h3 className="text-xl font-bold font-headline leading-tight mb-2 group-hover:text-accent transition-colors">{kitab.title}</h3>
                      <p className="text-muted-foreground text-sm italic">
                         {kitab.author}
                      </p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/5">
                      <a 
                        href={kitab.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-bold text-accent hover:text-white transition-all duration-200 group/link"
                      >
                        <Download size={16} className="group-hover/link:translate-y-0.5 transition-transform" /> 
                        <span className="uppercase tracking-widest text-[10px]">Akses Kitab Digital</span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
