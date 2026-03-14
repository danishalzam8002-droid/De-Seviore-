
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth, useUser } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useAuth();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const logo = PlaceHolderImages.find(img => img.id === 'batch-logo');

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Berhasil Masuk",
        description: "Selamat datang kembali di Konsol Admin De'Seviore.",
      });
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: "Email atau kata sandi salah. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-4">
          {logo && (
            <div className="mx-auto w-24 h-24 relative mb-4">
              <Image
                src={logo.imageUrl}
                alt="Logo De'Seviore"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(26,204,230,0.3)]"
              />
            </div>
          )}
          <h1 className="text-4xl font-headline font-bold accent-glow tracking-tight">
            De'Seviore
          </h1>
          <p className="text-muted-foreground font-light italic">
            "Warisan Keunggulan, Ikatan Persaudaraan"
          </p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              Masuk Admin
            </CardTitle>
            <CardDescription>
              Gunakan akun Anda untuk mengelola konten angkatan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@deseviore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-accent text-background font-bold hover:bg-accent/80"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Masuk Sekarang
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button variant="link" onClick={() => router.push("/")} className="text-muted-foreground hover:text-accent text-xs uppercase tracking-widest">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </main>
  );
}
