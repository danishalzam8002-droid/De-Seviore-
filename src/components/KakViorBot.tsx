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
            0%, 95%, 100% { transform: rotate(0deg); }
            96% { transform: rotate(-15deg); }
            97% { transform: rotate(10deg); }
            98% { transform: rotate(-5deg); }
          }
          @keyframes body-float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-2px) rotate(0.5deg); }
          }
          @keyframes eye-saccade {
            0%, 70%, 95%, 100% { transform: translate(0, 0); }
            80%, 90% { transform: translate(1px, -0.5px); }
          }
          @keyframes eye-blink-snappy {
            0%, 96%, 99%, 100% { transform: scaleY(1); }
            97.5% { transform: scaleY(0); }
          }
          .bot-arm {
            transform-origin: 18px 14px;
            animation: wave 15s ease-in-out infinite;
          }
          .bot-body {
            animation: body-float 8s ease-in-out infinite;
          }
          .bot-eye-group {
            animation: eye-saccade 12s step-end infinite;
          }
          .bot-eye {
            transform-origin: center;
            animation: eye-blink-snappy 10s ease-in-out infinite;
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
          @keyframes menu-pop {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-menu-pop {
            animation: menu-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
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
      text: (
        <div className="space-y-3">
          <p>Halo! Aku <b>Kak Vior</b>, santri virtual De Seviore. Selamat datang! ✨</p>
          <p className="text-[11px] text-white/60 mb-2">Pilih menu di bawah untuk bantuan cepat:</p>
          <div className="grid grid-cols-1 gap-2">
            <button 
              onClick={() => handleSendMessage(undefined, "Tanya tentang Pendaftaran")}
              className="group flex items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/30 p-2.5 rounded-xl transition-all hover:translate-x-1 animate-menu-pop [animation-delay:0.2s] text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-background group-hover:scale-110 transition-transform">
                <Send size={16} />
              </div>
              <div>
                <p className="font-bold text-xs text-accent">INFO PENDAFTARAN</p>
                <p className="text-[9px] text-white/60">Alur, Biaya, & Syarat</p>
              </div>
            </button>
            <button 
              onClick={() => handleSendMessage(undefined, "Buka Berita Al-Azhar")}
              className="group flex items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/30 p-2.5 rounded-xl transition-all hover:translate-x-1 animate-menu-pop [animation-delay:0.3s] text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-background group-hover:scale-110 transition-transform">
                <Bot size={16} />
              </div>
              <div>
                <p className="font-bold text-xs text-accent">BERITA AL-AZHAR</p>
                <p className="text-[9px] text-white/60">Info Kegiatan & Prestasi</p>
              </div>
            </button>
            <button 
              onClick={() => handleSendMessage(undefined, "Akses Kitab Digital")}
              className="group flex items-center gap-3 bg-accent/20 hover:bg-accent/30 border border-accent/30 p-2.5 rounded-xl transition-all hover:translate-x-1 animate-menu-pop [animation-delay:0.4s] text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-background group-hover:scale-110 transition-transform">
                <MessageCircle size={16} />
              </div>
              <div>
                <p className="font-bold text-xs text-accent">KITAB DIGITAL</p>
                <p className="text-[9px] text-white/60">Baca Koleksi Kitab</p>
              </div>
            </button>
          </div>
        </div>
      ),
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

      if (lowerInput.includes("biaya") || lowerInput.includes("harga") || lowerInput.includes("bayar") || lowerInput.includes("rincian") || lowerInput.includes("daftar") || lowerInput.includes("pendaftaran") || lowerInput.includes("alur")) {
        botResponse = (
          <div className="space-y-4">
            <p className="font-bold border-b border-accent/20 pb-2 text-white uppercase">Informasi Pendaftaran & Biaya</p>
            
            {/* Biaya Section */}
            <div className="space-y-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <p className="font-bold text-accent text-[11px] uppercase tracking-wider">Rincian Biaya Masuk</p>
              <table className="w-full text-[10px] text-white/80">
                <tbody className="divide-y divide-white/5">
                  <tr><td className="py-1">Infaq Pendidikan</td><td className="text-right py-1">Rp 1.500.000</td></tr>
                  <tr><td className="py-1">Sewa Lemari & Ranjang</td><td className="text-right py-1">Rp 600.000</td></tr>
                  <tr><td className="py-1">Perlengkapan (Kasur & Seragam)</td><td className="text-right py-1">Rp 1.400.000</td></tr>
                  <tr><td className="py-1">Infaq Bangunan</td><td className="text-right py-1">Rp 1.500.000</td></tr>
                  <tr><td className="py-1">Buku (2 Semester)</td><td className="text-right py-1">Rp 800.000</td></tr>
                  <tr className="font-bold text-white"><td className="pt-2">TOTAL BIAYA MASUK</td><td className="text-right pt-2">Rp 5.800.000</td></tr>
                </tbody>
              </table>
              <div className="pt-2 border-t border-white/5">
                <p className="font-bold text-accent text-[11px] uppercase tracking-wider">Infaq Bulanan</p>
                <p className="text-[10px] text-white/80">Makan, SPP, & Kepondokan: <span className="font-bold text-white">Rp 1.200.000</span></p>
              </div>
            </div>

            {/* Medsos Section */}
            <div className="space-y-2">
              <p className="font-bold text-accent text-[11px] uppercase tracking-wider">Pendaftaran Online & Medsos</p>
              <div className="grid grid-cols-1 gap-2">
                <a href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-accent/20 border border-accent/40 p-2 rounded-lg text-[10px] font-bold text-white hover:bg-accent/30 transition-colors">
                  DAFTAR SEKARANG (WEB RESMI) <Send size={12} />
                </a>
                <a href="https://www.instagram.com/azhar_tv_" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-lg text-[10px] font-medium text-white/80 hover:bg-white/10 transition-colors">
                  INSTAGRAM: @azhar_tv_ <Bot size={12} />
                </a>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="font-bold text-accent text-[11px] uppercase tracking-wider">Hubungi Kami (WhatsApp)</p>
              <div className="space-y-2">
                <div className="p-2 bg-accent/5 rounded-lg border border-accent/10">
                  <p className="font-bold text-white text-[10px]">PONDOK: 0812-8985-2035</p>
                  <p className="text-[9px] text-white/60">A.N CECEP RAHMAT</p>
                </div>
                <div className="grid grid-cols-1 gap-1 pl-2 border-l border-accent/30">
                  <p className="text-[9px] font-bold text-accent/80 italic mb-1">* Bisa Mondok & Non Mondok:</p>
                  <p className="text-[9px] text-white/80"><span className="font-bold">SDIT:</span> 0895-3377-2941 a.n Elisa</p>
                  <p className="text-[9px] text-white/80"><span className="font-bold">SMP I:</span> 0812-7415-6718 a.n Husein</p>
                  <p className="text-[9px] text-white/80"><span className="font-bold">MA:</span> 0831-9753-0389 a.n Ahmad Riki</p>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (lowerInput.includes("contact") || lowerInput.includes("nomor") || lowerInput.includes("hubungi") || lowerInput.includes("wa") || lowerInput.includes("person") || lowerInput.includes("telp")) {
        botResponse = (
          <div className="space-y-4">
            <p className="font-bold border-b border-accent/20 pb-2 text-white">CONTACT PERSON</p>
            <div className="space-y-3">
              <div className="bg-accent/10 p-2 rounded-lg border border-accent/20">
                <p className="font-bold text-accent text-xs">PONDOK</p>
                <p className="text-[11px]">0812-8985-2035 (A.N CECEP RAHMAT)</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-white/60 font-medium">* Bisa Mondok & Non Mondok:</p>
                <div className="pl-2 space-y-2 border-l border-accent/30">
                  <div>
                    <p className="font-bold text-white text-[11px]">SDIT AL-AZHAR</p>
                    <p className="text-[10px]">0895-3377-2941 a.n Elisa Setiawati</p>
                  </div>
                  <div>
                    <p className="font-bold text-white text-[11px]">SMP I AL-AZHAR</p>
                    <p className="text-[10px]">0812-7415-6718 a.n Muh. Husein</p>
                  </div>
                  <div>
                    <p className="font-bold text-white text-[11px]">MA UNGGULAN AL-AZHAR</p>
                    <p className="text-[10px]">0831-9753-0389 a.n AHMAD RIKI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (lowerInput.includes("jadwal") || lowerInput.includes("gelombang") || lowerInput.includes("kapan")) {
        botResponse = (
          <div className="space-y-2">
            <p>Untuk jadwal pendaftaran terupdate, Akang/Teteh bisa langsung cek di:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Web Resmi: <a href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta#schedule" target="_blank" rel="noopener noreferrer" className="text-accent underline font-bold">alazharpwk.cazh.id</a></li>
              <li>Instagram: <a href="https://www.instagram.com/azhar_tv_" target="_blank" rel="noopener noreferrer" className="text-accent underline font-bold">@azhar_tv_</a></li>
            </ul>
            <p className="text-[10px] mt-2 italic text-white/60">Yuk! Jangan sampai ketinggalan gelombangnya ya.</p>
          </div>
        );
      } else if (lowerInput.includes("berita") || lowerInput.includes("news") || lowerInput.includes("kegiatan") || lowerInput.includes("info")) {
        botResponse = "Kamu bisa mengecek berita terbaru Al-Azhar di menu 'Tentang Al-Azhar'. Di sana Kak Vior sering membagikan info kegiatan, prestasi santri, dan pengumuman terbaru lho!";
      } else if (lowerInput.includes("perpus") || lowerInput.includes("kitab") || lowerInput.includes("buku") || lowerInput.includes("baca")) {
        botResponse = "Di menu 'Perpustakaan', kita punya banyak koleksi kitab digital karya ulama. Kamu cukup ketik judul atau nama pengarang di kolom pencarian, lalu klik 'Akses Kitab' untuk membacanya secara online.";
      } else if (lowerInput.includes("halo") || lowerInput.includes("hai") || lowerInput.includes("hi") || lowerInput.includes("assalam")) {
        botResponse = "Wa'alaikumussalam! Hai juga! Yuk tanya seputar Pendaftaran, Biaya, Jadwal, Contact Person, atau fasilitas lainnya.";
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

  const QuickOption = ({ text, delay }: { text: string, delay: string }) => (
    <button
      onClick={() => handleSendMessage(undefined, text)}
      style={{ animationDelay: delay }}
      className="text-[10px] text-left px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl transition-all border border-accent/20 hover:scale-105 active:scale-95 animate-menu-pop flex-shrink-0 max-w-fit shadow-sm"
    >
      {text}
    </button>
  );

  return (
    <>
      {/* Floating Button Area */}
      <div className={cn("fixed bottom-28 md:bottom-12 right-6 md:right-12 z-50 flex flex-col items-end gap-2", isOpen && "hidden")}>
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
            Bingung?? tanya sama kak vior
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
        <div className="fixed bottom-28 md:bottom-12 right-6 md:right-12 w-[340px] h-[500px] max-h-[70vh] glass-card rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl border border-white/20 animate-in slide-in-from-bottom-5">
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
            <div className="flex flex-wrap gap-2 mt-4 ml-11">
              <QuickOption text="Bagaimana alur pendaftarannya?" delay="0.1s" />
              <QuickOption text="Berapa biaya pendaftarannya?" delay="0.2s" />
              <QuickOption text="Kapan jadwal pendaftarannya?" delay="0.3s" />
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
