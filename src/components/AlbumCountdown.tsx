"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Timer, Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function AlbumCountdown({ targetDate, onComplete }: { targetDate: Date, onComplete?: () => void }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (!timeLeft) return null;

  const timeBlocks = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex justify-center gap-2 text-accent mb-4">
          <Lock className="w-6 h-6 animate-pulse" />
          <Timer className="w-6 h-6" />
        </div>
        <h3 className="text-2xl md:text-3xl font-headline font-bold text-white tracking-wider uppercase">
          Album Kenangan Angkatan 7
        </h3>
        <motion.p 
          animate={{ 
            opacity: [0.6, 1, 0.6],
            scale: [0.98, 1, 0.98]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut" 
          }}
          className="text-accent text-base md:text-lg font-bold tracking-wide max-w-xl mx-auto drop-shadow-[0_0_15px_rgba(26,204,230,0.4)]"
        >
          ✨ Lihat dan unduh album kenangan setelah momen wisuda tiba! ✨
        </motion.p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {timeBlocks.map((block, i) => (
          <motion.div
            key={block.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="relative w-20 h-24 md:w-28 md:h-32 flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group-hover:border-accent/30 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={block.value}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="text-3xl md:text-5xl font-mono font-bold text-accent drop-shadow-[0_0_15px_rgba(26,204,230,0.4)]"
                >
                  {String(block.value).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 group-hover:text-accent transition-colors">
              {block.label}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground/80 font-mono"
      >
        <Sparkles size={14} className="text-yellow-400" />
        <span>Dibuka 31 Mei 2026, 20:00 WIB</span>
      </motion.div>
    </div>
  );
}
