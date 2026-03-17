
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Home, Settings, LogIn, LogOut, Building2, Info, BookOpen } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("isAdmin");
      }
      if (auth) {
        await signOut(auth as any);
      }
      toast({
        title: "Keluar Berhasil",
        description: "Anda telah keluar dari sesi admin.",
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass-card border-white/20 flex items-center gap-8">
      
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
        <DropdownMenuContent side="top" sideOffset={16} align="center" className="border-white/10 bg-background/80 backdrop-blur-xl mb-2">
          <DropdownMenuItem asChild className="focus:bg-white/10">
            <Link href="/alazhar/info-pendaftaran" className="cursor-pointer w-full flex items-center gap-2">
              <Info size={16} /> Info Pendaftaran
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="focus:bg-white/10">
            <Link href="/alazhar/tentang" className="cursor-pointer w-full flex items-center gap-2">
              <Building2 size={16} /> Tentang Al-Azhar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="focus:bg-white/10">
            <Link href="/alazhar/perpustakaan" className="cursor-pointer w-full flex items-center gap-2">
              <BookOpen size={16} /> Perpustakaan
            </Link>
          </DropdownMenuItem>
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

      {/* 5. Auth (Keluar / Masuk) */}
      {user ? (
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-destructive transition-colors duration-200"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Keluar</span>
        </button>
      ) : (
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
    </nav>
  );
}
