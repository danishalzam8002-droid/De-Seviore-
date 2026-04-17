"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, MessageCircleQuestion } from "lucide-react";
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
      <style>
        {`
          @keyframes wave {
            0%, 90%, 100% { transform: rotate(0deg); }
            92% { transform: rotate(-25deg); }
            94% { transform: rotate(15deg); }
            96% { transform: rotate(-20deg); }
            98% { transform: rotate(5deg); }
          }
          @keyframes body-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-1.5px) rotate(1.5deg); }
            75% { transform: translateY(0.5px) rotate(-1deg); }
          }
          @keyframes eye-saccade {
            0%, 40%, 80%, 100% { transform: translate(0, 0); }
            45% { transform: translate(1.5px, -0.5px); }
            50% { transform: translate(1.5px, -0.5px); }
            85% { transform: translate(-1px, 0.5px); }
            90% { transform: translate(-1px, 0.5px); }
          }
          @keyframes eye-blink-snappy {
            0%, 48%, 52%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0); }
          }
          .bot-arm {
            transform-origin: 18px 14px;
            animation: wave 6s ease-in-out infinite;
          }
          .bot-body {
            animation: body-float 5s ease-in-out infinite;
          }
          .bot-eye-group {
            animation: eye-saccade 7s step-end infinite;
          }
          .bot-eye {
            transform-origin: center;
            animation: eye-blink-snappy 4s ease-in-out infinite;
          }
          /* Main Bot: Peeks, looks left, looks right */
          @keyframes peek-main {
            0%, 10%, 90%, 100% { transform: translateY(50px) scale(0.8); opacity: 0; }
            15%, 85% { transform: translateY(0) scale(1); opacity: 1; }
            30%, 45% { transform: translateY(-5px) rotate(-5deg); } /* Looking at side bot 1 */
            60%, 75% { transform: translateY(-3px) rotate(5deg); }  /* Looking at mini bot */
          }
          /* Side Bot 1: Peeks and looks at main bot */
          @keyframes peek-side-interaction {
            0%, 25%, 75%, 100% { transform: translateX(30px) scale(0.6); opacity: 0; }
            35%, 65% { transform: translateX(0) scale(0.9) rotate(-15deg); opacity: 1; }
            45%, 55% { transform: translateX(5px) scale(0.9) rotate(-10deg); } /* Leaning towards main */
          }
          /* Mini Bot: Jumps in quickly when main bot is looking right */
          @keyframes peek-mini-interaction {
            0%, 55%, 95%, 100% { transform: translateY(30px) scale(0.5); opacity: 0; }
            65%, 85% { transform: translateY(0) scale(0.8) rotate(10deg); opacity: 1; }
            70%, 80% { transform: translateY(-8px) scale(0.9) rotate(20deg); } /* Excited jump */
          }
          .animate-peek-bot {
            animation: peek-main 10s ease-in-out infinite;
          }
          .animate-peek-bot-side {
            animation: peek-side-interaction 10s ease-in-out infinite;
          }
          .animate-peek-bot-mini {
            animation: peek-mini-interaction 10s ease-in-out infinite;
          }
          @keyframes text-float-pop {
            0%, 15%, 85%, 100% { transform: translateY(10px) scale(0); opacity: 0; }
            20%, 80% { transform: translateY(0) scale(1); opacity: 1; }
            45%, 55% { transform: translateY(-5px); }
          }
          .animate-bot-talk {
            animation: text-float-pop 10s ease-in-out infinite;
          }
          .animate-bot-talk-side {
            animation: text-float-pop 10s ease-in-out infinite;
            animation-delay: 1.5s;
          }
          .animate-bot-talk-mini {
            animation: text-float-pop 10s ease-in-out infinite;
            animation-delay: 3s;
          }
        `}
      </style>

      <g className="bot-body">
        {/* Antenna */}
        <path d="M12 6V3M12 3H15M12 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="3" r="1.5" fill="currentColor" className="animate-pulse" />
        
        {/* Head Shell */}
        <rect x="4" y="6" width="16" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
        
        {/* visor backdrop */}
        <rect x="6" y="8" width="12" height="6" rx="1.5" fill="currentColor" fillOpacity="0.15" />
        
        {/* Eyes Group with Saccades */}
        <g className="bot-eye-group">
          <g className="bot-eye">
            <circle cx="9.5" cy="11" r="1.8" fill="currentColor">
              <animate attributeName="r" values="1.8;2.2;1.8" dur="5s" repeatCount="indefinite" />
            </circle>
            {/* Pupil Glint */}
            <circle cx="10" cy="10.5" r="0.5" fill="white" fillOpacity="0.8" />
          </g>
          <g className="bot-eye">
            <circle cx="14.5" cy="11" r="1.8" fill="currentColor">
              <animate attributeName="r" values="1.8;2.2;1.8" dur="5s" repeatCount="indefinite" />
            </circle>
            {/* Pupil Glint */}
            <circle cx="15" cy="10.5" r="0.5" fill="white" fillOpacity="0.8" />
          </g>
        </g>
        
        {/* Cute Mouth/Light */}
        <circle cx="12" cy="14.5" r="0.8" fill="currentColor" fillOpacity="0.6">
           <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Torso */}
        <path d="M7 17C7 17 6 21 12 21C18 21 17 17 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      
      {/* Waving Arm */}
      <path 
        className="bot-arm" 
        d="M18 14L21 11C21.5 10.5 22.5 10.5 22.5 11.5C22.5 12.5 21.5 13 21 13.5L18 16" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
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
        {/* Peeking Robots Group */}
        <div className="relative w-full flex justify-end">
          {/* Main Bot */}
          <div className="absolute -top-12 right-12 animate-peek-bot pointer-events-none">
            {/* Floating Thought/Text */}
            <div className="absolute -top-6 -right-2 bg-accent text-background text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-bot-talk shadow-lg">
               AL-AZHAR?
            </div>
            <AnimatedBotIcon size={48} className="text-accent drop-shadow-[0_0_10px_rgba(26,204,230,0.6)]" />
          </div>
          
          {/* Side Bot 1 */}
          <div className="absolute -top-6 right-36 animate-peek-bot-side pointer-events-none">
            <div className="absolute -top-4 -right-1 bg-accent/80 text-background text-[7px] font-bold px-1 py-0.5 rounded-full animate-bot-talk-side shadow-md">
               ??
            </div>
            <AnimatedBotIcon size={36} className="text-accent/80 drop-shadow-[0_0_8px_rgba(26,204,230,0.4)]" />
          </div>

          {/* Side Bot 2 (Mini) */}
          <div className="absolute -top-10 right-2 animate-peek-bot-mini pointer-events-none">
            <div className="absolute -top-4 -left-1 bg-accent/60 text-background text-[6px] font-bold px-1 py-0.5 rounded-full animate-bot-talk-mini shadow-sm">
               ??
            </div>
            <AnimatedBotIcon size={28} className="text-accent/60 drop-shadow-[0_0_6px_rgba(26,204,230,0.3)]" />
          </div>

          <div className="bg-background/95 backdrop-blur-md border border-accent/40 text-accent px-4 py-2 rounded-2xl rounded-br-sm text-sm font-semibold shadow-[0_0_15px_rgba(26,204,230,0.2)] animate-pulse whitespace-nowrap z-10 transition-transform hover:scale-105 duration-300">
            Bingung??, tanya sama kak vior
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 shadow-[0_0_20px_rgba(26,204,230,0.4)] transition-transform hover:scale-110 duration-500 animate-bounce flex items-center justify-center p-0 overflow-hidden"
        >
          <MessageCircleQuestion size={32} className="text-background" />
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
