"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { MessageCircle, X, Send, Bot, User, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string | ReactNode;
};

function AnimatedBotIcon({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Head Shell */}
      <rect x="3" y="6" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6V3M12 3H15M12 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="19" width="2" height="2" fill="currentColor" />
      <rect x="15" y="19" width="2" height="2" fill="currentColor" />
      
      {/* Visor Area */}
      <rect x="6" y="9" width="12" height="5" rx="1" fill="currentColor" fillOpacity="0.2" />
      
      {/* Animated Eyes */}
      <g className="animate-bot-eyes">
        <circle cx="9" cy="11.5" r="1.5" fill="currentColor">
          <animate 
            attributeName="cy" 
            values="11.5;11.5;10.5;11.5;11.5" 
            dur="4s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="cx" 
            values="9;10;9;8;9" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </circle>
        <circle cx="15" cy="11.5" r="1.5" fill="currentColor">
          <animate 
            attributeName="cy" 
            values="11.5;11.5;10.5;11.5;11.5" 
            dur="4s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="cx" 
            values="15;16;15;14;15" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </circle>
      </g>
      
      {/* Blinking Overlay */}
      <rect x="7.5" y="10" width="9" height="3" fill="none" className="animate-bot-blink">
        <animate 
          attributeName="fill" 
          values="none;currentColor;none" 
          dur="5s" 
          begin="2s"
          repeatCount="indefinite" 
        />
      </rect>
    </svg>
  );
}

export function KakViorBot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Halo! Aku Kak Vior, santri virtual De Seviore. Ada yang bisa kubantu terkait Pendaftaran, Berita Al-Azhar, atau Perpustakaan?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [committedText, setCommittedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const startSpeechToText = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Browser Tidak Mendukung",
        description: "Maaf, browsermu tidak mendukung fitur suara.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setCommittedText(prev => (prev.trim() + " " + finalTranscript).trim());
        setInputText(prev => (prev.trim() + " " + finalTranscript).trim());
      } else {
        // Show committed + current interim
        setInputText((committedText.trim() + " " + interimTranscript).trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Rec Error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast({
          title: "Izin Ditolak",
          description: "Mohon izinkan akses mikrofon di browsermu.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    
    // Auto-stop mic if user clicks send while listening
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    if (!customText) {
      setInputText("");
      setCommittedText("");
    }
    
    setIsTyping(true);

    // Simple Rule-Based AI response (Restored)
    setTimeout(() => {
      let botResponse: string | ReactNode = "Maaf, Kak Vior kurang paham maksudmu. Boleh tanya tentang Pendaftaran, Berita Al-Azhar, atau Perpustakaan?";
      const textVal = typeof userMessage.text === "string" ? userMessage.text : "";
      const lowerInput = textVal.toLowerCase();

      if (lowerInput.includes("biaya") || lowerInput.includes("harga") || lowerInput.includes("bayar") || lowerInput.includes("rincian")) {
        botResponse = (
          <div className="space-y-4">
            <p className="font-bold border-b border-accent/20 pb-2 text-white">RINCIAN BIAYA</p>
            
            <div>
              <p className="font-bold text-accent mb-1">BIAYA MASUK DAN KELENGKAPAN</p>
              <table className="w-full text-xs text-white/80">
                <tbody>
                  <tr><td>INFAQ PENDIDIKAN</td><td className="text-right">Rp 1.500.000</td></tr>
                  <tr><td>SEWA LEMARI</td><td className="text-right">Rp 300.000</td></tr>
                  <tr><td>SEWA RANJANG</td><td className="text-right">Rp 300.000</td></tr>
                  <tr><td>BELI KASUR</td><td className="text-right">Rp 500.000</td></tr>
                  <tr><td>SERAGAM</td><td className="text-right">Rp 900.000</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <p className="font-bold text-accent justify-between mb-1">INFAQ TAHUNAN</p>
              <table className="w-full text-xs text-white/80">
                <tbody>
                  <tr><td>INFAQ BANGUNAN</td><td className="text-right">Rp 1.500.000</td></tr>
                  <tr><td>BUKU PELAJARAN 2 SEMESTER</td><td className="text-right">Rp 800.000</td></tr>
                  <tr className="font-bold border-t border-accent/20"><td className="pt-1 text-white">TOTAL BIAYA MASUK</td><td className="text-right pt-1 text-white">Rp 5.800.000</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <p className="font-bold text-accent mb-1">INFAQ BULANAN</p>
              <table className="w-full text-xs text-white/80">
                <tbody>
                  <tr><td>MAKAN</td><td className="text-right">Rp 700.000</td></tr>
                  <tr><td>KEPONDOKAN</td><td className="text-right">Rp 300.000</td></tr>
                  <tr><td>SPP</td><td className="text-right">Rp 200.000</td></tr>
                  <tr className="font-bold border-t border-accent/20"><td className="pt-1 text-white">TOTAL BIAYA BULANAN</td><td className="text-right pt-1 text-white">Rp 1.200.000</td></tr>
                </tbody>
              </table>
            </div>

            <p className="font-bold text-[10px] bg-accent/20 p-2 rounded-lg text-center text-accent">
              FORMULIR PENDAFTARAN / REGISTRASI<br/>Rp 250.000
            </p>

            <a href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta#schedule" target="_blank" rel="noopener noreferrer" className="block text-center w-full mt-2 font-bold underline hover:text-accent transition-all text-[10px] text-white/60">Lihat Jadwal & Promo di Web Resmi</a>
          </div>
        );
      } else if (lowerInput.includes("alur") || lowerInput.includes("cara") || lowerInput.includes("step") || lowerInput.includes("daftar") || lowerInput.includes("pendaftaran")) {
        botResponse = "Berikut alur pendaftaran Ponpes Al-Azhar Purwakarta:\n1. Isi formulir pendaftaran di web resmi dengan data lengkap.\n2. Jika ada biaya pendaftaran, lakukan pembayaran melalui Bank atau Minimarket.\n3. Proses seleksi dapat dicek secara real time.\n4. Hasil penerimaan bisa dicek online menggunakan nomor pendaftaran.\n5. Peserta Diterima wajib melakukan daftar ulang untuk konfirmasi dan memperoleh Nomor Kartu.";
      } else if (lowerInput.includes("jadwal") || lowerInput.includes("kapan") || lowerInput.includes("gelombang")) {
        botResponse = "Jadwal pendaftaran terbagi dua:\n- Gelombang 1: 1 Oktober 2026 s.d 13 Desember 2026\n- Gelombang 2: 15 Desember 2026 s.d 31 Juli 2027\nYuk! Jangan sampai ketinggalan.";
      } else if (lowerInput.includes("berita") || lowerInput.includes("news") || lowerInput.includes("kegiatan") || lowerInput.includes("info")) {
        botResponse = "Kamu bisa mengecek berita terbaru Al-Azhar di menu 'Tentang Al-Azhar'. Di sana Kak Vior sering membagikan info kegiatan, prestasi santri, dan pengumuman terbaru lho!";
      } else if (lowerInput.includes("perpus") || lowerInput.includes("kitab") || lowerInput.includes("buku") || lowerInput.includes("baca")) {
        botResponse = "Di menu 'Perpustakaan', kita punya banyak koleksi kitab digital karya ulama. Kamu cukup ketik judul atau nama pengarang di kolom pencarian, lalu klik 'Akses Kitab' untuk membacanya secara online.";
      } else if (lowerInput.includes("halo") || lowerInput.includes("hai") || lowerInput.includes("hi") || lowerInput.includes("assalam")) {
        botResponse = "Wa'alaikumussalam! Hai juga! Yuk tanya seputar Pendaftaran, Biaya, Jadwal, atau fasilitas lainnya.";
      }

      // Navigation Command Detection
      const navWords = ["buka", "ke", "halaman", "lihat", "tampilkan", "akses"];
      const isNav = navWords.some(word => lowerInput.includes(word));
      
      let targetPath = "";
      if (isNav) {
        if (lowerInput.includes("dashboard") || lowerInput.includes("admin")) targetPath = "/admin/dashboard";
        else if (lowerInput.includes("perpus") || lowerInput.includes("kitab") || lowerInput.includes("baca")) targetPath = "/alazhar/perpustakaan";
        else if (lowerInput.includes("daftar") || lowerInput.includes("pendaftaran") || lowerInput.includes("registrasi")) targetPath = "/alazhar/info-pendaftaran";
        else if (lowerInput.includes("tentang") || lowerInput.includes("sejarah") || lowerInput.includes("profil") || lowerInput.includes("berita")) targetPath = "/alazhar/tentang";
        else if (lowerInput.includes("album") || lowerInput.includes("galeri") || lowerInput.includes("foto") || lowerInput.includes("video")) targetPath = "/albums";
        else if (lowerInput.includes("anggota") || lowerInput.includes("member") || lowerInput.includes("santri")) targetPath = "/members";

        if (targetPath) {
          botResponse = `Siap! Langsung Kak Vior antar ya...`;
          setTimeout(() => {
            router.push(targetPath);
            setIsOpen(false);
          }, 800);
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const QuickOption = ({ text }: { text: string }) => (
    <button
      onClick={() => handleSendMessage(undefined, text)}
      className="text-xs text-left px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors border border-accent/20"
    >
      {text}
    </button>
  );

  return (
    <>
      {/* Floating Button Area */}
      <div className={cn("fixed bottom-24 md:bottom-12 right-6 md:right-12 z-50 flex flex-col items-end gap-2", isOpen && "hidden")}>
        <div className="bg-background/90 backdrop-blur-sm border border-accent/40 text-accent px-4 py-2 rounded-2xl rounded-br-sm text-sm font-medium shadow-[0_0_15px_rgba(26,204,230,0.2)] animate-pulse whitespace-nowrap">
          Bingung?? Yuk tanya Kak Vior
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-accent hover:bg-accent/80 shadow-[0_0_20px_rgba(26,204,230,0.4)] transition-transform hover:scale-110 duration-500 animate-bounce"
        >
          <MessageCircle size={28} className="text-background" />
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 md:bottom-12 right-6 md:right-12 w-[340px] h-[500px] max-h-[70vh] glass-card rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl border border-white/20 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-accent/10 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-accent/20 animate-pulse"></div>
                <AnimatedBotIcon size={26} className="text-background relative z-10" />
              </div>
              <div>
                <h3 className="font-bold text-accent">Kak Vior</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Santri Virtual Al-Azhar</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white">
              <X size={20} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.sender === "user" ? "bg-white/10" : "bg-accent/20"
                )}>
                  {msg.sender === "user" ? <User size={14} className="text-white" /> : <AnimatedBotIcon size={16} className="text-accent" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl text-sm whitespace-pre-line",
                  msg.sender === "user" 
                    ? "bg-white/10 text-white rounded-tr-none" 
                    : "bg-accent/10 text-white border border-accent/20 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center relative overflow-hidden">
                  <AnimatedBotIcon size={16} className="text-accent" />
                </div>
                <div className="bg-accent/10 border border-accent/20 p-3 rounded-2xl rounded-tl-none flex gap-1">
                  <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4 ml-11">
              <QuickOption text="Bagaimana alur pendaftarannya?" />
              <QuickOption text="Berapa biaya pendaftarannya?" />
              <QuickOption text="Kapan jadwal pendaftarannya?" />
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-background/50 relative">
            {isListening && (
              <div className="absolute -top-8 left-4 right-4 flex items-center gap-2 animate-in slide-in-from-bottom-2">
                 <div className="flex gap-1">
                    <span className="w-1 h-3 bg-accent animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-3 bg-accent animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-3 bg-accent animate-bounce"></span>
                 </div>
                 <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Kak Vior sedang mendengarkan...</span>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={startSpeechToText}
                className={cn(
                  "shrink-0 border-white/20 hover:border-accent/40 transition-all duration-300",
                  isListening && "bg-accent text-background animate-pulse shadow-[0_0_15px_rgba(26,204,230,0.6)] border-accent"
                )}
              >
                {isListening ? <MicOff size={18} className="animate-bounce" /> : <Mic size={18} />}
              </Button>
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Mendengarkan..." : (isTyping ? "Kak Vior menjawab..." : "Ketik pertanyaanmu...")}
                className="bg-background/80 border-white/20"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!inputText.trim() || isTyping} className="bg-accent text-background hover:bg-accent/80 shrink-0">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
