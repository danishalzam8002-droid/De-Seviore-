
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Loader2 } from "lucide-react";
import { suggestQuote } from "@/ai/flows/quote-suggestion-flow";
import { toast } from "@/hooks/use-toast";

interface QuoteGeneratorProps {
  onQuoteGenerated: (quote: string) => void;
}

export function QuoteGenerator({ onQuoteGenerated }: QuoteGeneratorProps) {
  const [keywords, setKeywords] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Kata kunci diperlukan",
        description: "Silakan masukkan beberapa tema untuk kutipan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await suggestQuote({ keywords });
      onQuoteGenerated(result.quote);
      toast({
        title: "Berhasil!",
        description: "Kutipan berhasil dibuat.",
      });
    } catch (error: any) {
      console.error("Generate Error Detail:", error);
      toast({
        title: "Gagal Membuat Kutipan",
        description: error.message || "Cek koneksi atau API Key Anda.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
      <div className="flex items-center gap-2 text-accent">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">Saran Kutipan AI</span>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="contoh: ketekunan, pertumbuhan, komunitas"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="bg-background/50"
        />
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading}
          className="bg-accent text-background hover:bg-accent/80"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Saran"}
        </Button>
      </div>
    </div>
  );
}
