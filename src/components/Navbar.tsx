
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Home, Settings, LogIn, Building2, Info, BookOpen } from "lucide-react";
import { useUser } from "@/hooks/use-supabase-user";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, x: "-50%", opacity: 1 },
        hidden: { y: 100, x: "-50%", opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed bottom-6 left-1/2 z-50 px-6 py-3 rounded-full glass-card border-white/20 flex items-center gap-6 md:gap-8"
    >
      
      {/* 1. Beranda */}
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center gap-1 transition-colors duration-200",
          pathname === "/" ? "text-accent" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Home size={20} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Beranda</span>
      </Link>

      {/* 2. Al-Azhar (Dropdown) */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200 outline-none">
          <Building2 size={20} className={pathname.startsWith("/alazhar") ? "text-accent" : ""} />
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest",
             pathname.startsWith("/alazhar") ? "text-accent" : ""
          )}>Al-Azhar</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="top" 
          sideOffset={16} 
          align="center" 
          className="border-white/10 bg-background/80 backdrop-blur-xl mb-2 p-2 min-w-[200px] overflow-visible"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="flex flex-col gap-1"
          >
            {[
              { href: "/alazhar/info-pendaftaran", icon: <Info size={16} />, title: "Info Pendaftaran", desc: "Alur & Biaya" },
              { href: "/alazhar/tentang", icon: <Building2 size={16} />, title: "Tentang Al-Azhar", desc: "Sejarah & Visi" },
              { href: "/alazhar/perpustakaan", icon: <BookOpen size={16} />, title: "Perpustakaan", desc: "Koleksi Kitab" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.5, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <DropdownMenuItem asChild className="focus:bg-accent/20 focus:text-accent p-0 rounded-xl overflow-hidden">
                  <Link 
                    href={item.href} 
                    className="cursor-pointer w-full flex items-center gap-3 p-3 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-background transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{item.title}</span>
                      <span className="text-[10px] opacity-60 font-medium">{item.desc}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </motion.div>
            ))}
          </motion.div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 3. Anggota */}
      <Link
        href="/members"
        className={cn(
          "flex flex-col items-center gap-1 transition-colors duration-200",
          pathname === "/members" ? "text-accent" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Users size={20} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Anggota</span>
      </Link>

      {/* 4. Admin (Jika Login) */}
      {user && (
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex flex-col items-center gap-1 transition-colors duration-200",
            pathname.startsWith("/admin") ? "text-accent" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
        </Link>
      )}

      {/* 5. Auth (Masuk) - Hanya jika belum login */}
      {!user && (
        <Link
          href="/login"
          className={cn(
            "flex flex-col items-center gap-1 transition-colors duration-200",
            pathname === "/login" ? "text-accent" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LogIn size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Masuk</span>
        </Link>
      )}
    </motion.nav>
  );
}
