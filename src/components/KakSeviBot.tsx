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

export function KakSeviBot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Halo! Aku Kak Sevi, asisten virtual De Seviore. Ada yang bisa kubantu terkait Pendaftaran, Berita Al-Azhar, atau Perpustakaan?",
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

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
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

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!customText) {
      setInputText("");
      setCommittedText("");
    }
    setIsTyping(true);

    try {
      // Sanitize messages: Ensure all 'text' fields are strictly strings
      const sanitizedMessages = newMessages.map(m => ({
        ...m,
        text: typeof m.text === "string" ? m.text : "Element Visual"
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: sanitizedMessages }),
      });

      if (!response.ok) throw new Error("Gagal mengambil jawaban AI.");
      
      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.text,
      };
      setMessages((prev) => [...prev, botMessage]);

      // Check for navigation commands in the bot's text
      const lowerBotText = data.text.toLowerCase();
      if (lowerBotText.includes("/admin/dashboard")) setTimeout(() => { router.push("/admin/dashboard"); setIsOpen(false); }, 1500);
      else if (lowerBotText.includes("/alazhar/perpustakaan")) setTimeout(() => { router.push("/alazhar/perpustakaan"); setIsOpen(false); }, 1500);
      else if (lowerBotText.includes("/alazhar/info-pendaftaran")) setTimeout(() => { router.push("/alazhar/info-pendaftaran"); setIsOpen(false); }, 1500);
      else if (lowerBotText.includes("/alazhar/tentang")) setTimeout(() => { router.push("/alazhar/tentang"); setIsOpen(false); }, 1500);
      else if (lowerBotText.includes("/albums")) setTimeout(() => { router.push("/albums"); setIsOpen(false); }, 1500);
      else if (lowerBotText.includes("/members")) setTimeout(() => { router.push("/members"); setIsOpen(false); }, 1500);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Maaf Kak, sepertinya sedang ada kendala koneksi ke otak AI Kak Sevi. Coba lagi nanti ya!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
            {isTyping && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center animate-bounce">
                  <Bot size={14} className="text-accent" />
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
                 <span className="text-[10px] text-accent font-bold uppercase tracking-wider">Kak Sevi sedang mendengarkan...</span>
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
                placeholder={isListening ? "Mendengarkan..." : (isTyping ? "Kak Sevi menjawab..." : "Ketik pertanyaanmu...")}
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
