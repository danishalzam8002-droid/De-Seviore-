"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string | ReactNode;
};

export function KakSeviBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Halo! Aku Kak Sevi, asisten virtual De Seviore. Ada yang bisa Kubantu terkait Pendaftaran, Berita Al-Azhar, atau Perpustakaan?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputText("");

    // Simple Rule-Based AI response
    setTimeout(() => {
      let botResponse: string | ReactNode = "Maaf, Kak Sevi kurang paham maksudmu. Boleh tanya tentang Pendaftaran, Berita, atau Perpustakaan?";
      const textVal = typeof userMessage.text === "string" ? userMessage.text : "";
      const lowerInput = textVal.toLowerCase();

      if (lowerInput.includes("biaya") || lowerInput.includes("harga") || lowerInput.includes("bayar") || lowerInput.includes("rincian")) {
        botResponse = (
          <div className="space-y-4">
            <p className="font-bold border-b border-accent/20 pb-2">RINCIAN BIAYA</p>
            
            <div>
              <p className="font-bold text-accent mb-1">BIAYA MASUK DAN KELENGKAPAN</p>
              <table className="w-full text-xs">
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
              <table className="w-full text-xs">
                <tbody>
                  <tr><td>INFAQ BANGUNAN</td><td className="text-right">Rp 1.500.000</td></tr>
                  <tr><td>BUKU PELAJARAN 2 SEMESTER</td><td className="text-right">Rp 800.000</td></tr>
                  <tr className="font-bold border-t border-accent/20"><td className="pt-1">TOTAL BIAYA MASUK</td><td className="text-right pt-1">Rp 5.800.000</td></tr>
                </tbody>
              </table>
            </div>

            <div>
              <p className="font-bold text-accent mb-1">INFAQ BULANAN</p>
              <table className="w-full text-xs">
                <tbody>
                  <tr><td>MAKAN</td><td className="text-right">Rp 700.000</td></tr>
                  <tr><td>KEPONDOKAN</td><td className="text-right">Rp 300.000</td></tr>
                  <tr><td>SPP</td><td className="text-right">Rp 200.000</td></tr>
                  <tr className="font-bold border-t border-accent/20"><td className="pt-1">TOTAL BIAYA BULANAN</td><td className="text-right pt-1">Rp 1.200.000</td></tr>
                </tbody>
              </table>
            </div>

            <p className="font-bold text-xs bg-accent/20 p-2 rounded-lg text-center">
              FORMULIR PENDAFTARAN / REGISTRASI<br/>Rp 250.000
            </p>

            <a href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta#schedule" target="_blank" rel="noopener noreferrer" className="block text-center w-full mt-2 font-bold underline hover:text-accent transition-all text-xs">Lihat Jadwal & Promo di Web Resmi</a>
          </div>
        );
      } else if (lowerInput.includes("alur") || lowerInput.includes("cara") || lowerInput.includes("step") || lowerInput.includes("daftar") || lowerInput.includes("pendaftaran")) {
        botResponse = "Berikut alur pendaftaran Ponpes Al-Azhar Purwakarta:\n1. Isi formulir pendaftaran di web resmi dengan data lengkap.\n2. Jika ada biaya pendaftaran, lakukan pembayaran melalui Bank atau Minimarket.\n3. Proses seleksi dapat dicek secara real time.\n4. Hasil penerimaan bisa dicek online menggunakan nomor pendaftaran.\n5. Peserta Diterima wajib melakukan daftar ulang untuk konfirmasi dan memperoleh Nomor Kartu.";
      } else if (lowerInput.includes("jadwal") || lowerInput.includes("kapan") || lowerInput.includes("gelombang")) {
        botResponse = "Jadwal pendaftaran terbagi dua:\n- Gelombang 1: 1 Oktober 2025 s.d 13 Desember 2025\n- Gelombang 2: 15 Desember 2025 s.d 31 Juli 2026\nYuk! Jangan sampai ketinggalan.";
      } else if (lowerInput.includes("berita") || lowerInput.includes("news") || lowerInput.includes("kegiatan") || lowerInput.includes("info")) {
        botResponse = "Kamu bisa mengecek berita terbaru Al-Azhar di menu 'Tentang Al-Azhar'. Di sana Kak Sevi sering membagikan info kegiatan, prestasi santri, dan pengumuman terbaru lho!";
      } else if (lowerInput.includes("perpus") || lowerInput.includes("kitab") || lowerInput.includes("buku") || lowerInput.includes("baca")) {
        botResponse = "Di menu 'Perpustakaan', kita punya banyak koleksi kitab digital karya ulama. Kamu cukup ketik judul atau nama pengarang di kolom pencarian, lalu klik 'Akses Kitab' untuk membacanya secara online.";
      } else if (lowerInput.includes("halo") || lowerInput.includes("hai") || lowerInput.includes("hi") || lowerInput.includes("assalam")) {
        botResponse = "Wa'alaikumussalam! Hai juga! Yuk tanya seputar Pendaftaran, Biaya, Jadwal, atau fasilitas lainnya.";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
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
          Bingung?? Yuk tanya Kak Sevi
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
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center animate-pulse">
                <Bot size={24} className="text-background" />
              </div>
              <div>
                <h3 className="font-bold text-accent">Kak Sevi</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Asisten Virtual Al-Azhar</p>
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
                  {msg.sender === "user" ? <User size={14} className="text-white" /> : <Bot size={14} className="text-accent" />}
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
            <div className="flex flex-col gap-2 mt-4 ml-11">
              <QuickOption text="Bagaimana alur pendaftarannya?" />
              <QuickOption text="Berapa biaya pendaftarannya?" />
              <QuickOption text="Kapan jadwal pendaftarannya?" />
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-background/50">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ketik pertanyaanmu..."
                className="bg-background/80 border-white/20"
              />
              <Button type="submit" size="icon" disabled={!inputText.trim()} className="bg-accent text-background hover:bg-accent/80 shrink-0">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
