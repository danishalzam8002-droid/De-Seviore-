
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, Home, Settings, LogIn, LogOut } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { toast } from "@/hooks/use-toast";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { auth } = useAuth();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: "Keluar Berhasil",
        description: "Anda telah keluar dari sesi admin.",
      });
      router.push("/");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const navItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/members", label: "Anggota", icon: Users },
  ];

  // Tambahkan menu Admin jika sudah login, jika tidak tampilkan Login
  if (user) {
    navItems.push({ href: "/admin/dashboard", label: "Admin", icon: Settings });
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass-card border-white/20 flex items-center gap-8">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors duration-200",
              isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
      
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
