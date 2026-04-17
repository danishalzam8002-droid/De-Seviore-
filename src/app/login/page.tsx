
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/hooks/use-supabase-user";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const logo = PlaceHolderImages.find(img => img.id === 'batch-logo');

  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Member"
  });
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Berhasil Masuk",
        description: "Selamat datang kembali di Konsol Admin De Seviore.",
      });
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Masuk",
        description: error.message || "Email atau kata sandi salah. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestData.email.includes("@gmail.com")) {
      toast({
        title: "Gunakan Akun Google",
        description: "Mohon gunakan alamat email Gmail untuk mendaftar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingRequest(true);
    try {
      const { error } = await supabase.from('requests').insert([{
        table_name: 'admins',
        action: 'ACCESS_REQUEST',
        data: requestData,
        requested_by: requestData.email,
        status: 'pending'
      }]);

      if (error) throw error;

      toast({
        title: "Permintaan Dikirim",
        description: "Akses login Anda sedang ditinjau oleh Admin Utama. Harap tunggu konfirmasi.",
      });
      setIsRequestOpen(false);
      setRequestData({ name: "", email: "", password: "", role: "Member" });
    } catch (e: any) {
      toast({
        title: "Gagal Mengambil Akses",
        description: e.message || "Terjadi kesalahan saat mengirim permintaan.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingRequest(false);
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
            <div className="mx-auto w-32 h-32 md:w-40 md:h-40 relative mb-4">
              <Image
                src={logo.imageUrl}
                alt="Logo De Seviore"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(26,204,230,0.3)]"
              />
            </div>
          )}
          <h1 className="text-4xl font-headline font-bold accent-glow tracking-tight">
            De Seviore
          </h1>
          <p className="text-muted-foreground font-light italic">
            "Al-Azhar Seventh Generation"
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
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
        
        <div className="flex flex-col items-center gap-2">
          <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-accent text-xs font-bold uppercase tracking-widest gap-2">
                <UserPlus size={14} /> Minta Akses Admin Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 rounded-3xl max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">Permintaan Akses</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  Isi data di bawah untuk mengajukan akun pengelola konten De Seviore.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRequestAccess} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="req-name" className="text-[10px] uppercase font-bold text-accent/70">Nama Lengkap</Label>
                  <Input 
                    id="req-name" 
                    value={requestData.name} 
                    onChange={e => setRequestData({...requestData, name: e.target.value})}
                    placeholder="Contoh: Ahmad Seviore"
                    required 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-email" className="text-[10px] uppercase font-bold text-accent/70">Akun Google (Gmail)</Label>
                  <Input 
                    id="req-email" 
                    type="email"
                    value={requestData.email} 
                    onChange={e => setRequestData({...requestData, email: e.target.value})}
                    placeholder="nama@gmail.com"
                    required 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-pass" className="text-[10px] uppercase font-bold text-accent/70">Kata Sandi Diinginkan</Label>
                  <Input 
                    id="req-pass" 
                    type="password"
                    value={requestData.password} 
                    onChange={e => setRequestData({...requestData, password: e.target.value})}
                    placeholder="Min. 6 karakter"
                    required 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="req-role" className="text-[10px] uppercase font-bold text-accent/70">Role yang Diminati</Label>
                  <Select value={requestData.role} onValueChange={v => setRequestData({...requestData, role: v})}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Pilih Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-white/10">
                      <SelectItem value="Member">Member (Upload Galeri)</SelectItem>
                      <SelectItem value="Admin">Admin (Kelola Data)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-accent text-background font-bold tracking-widest mt-6" disabled={isSubmittingRequest}>
                  {isSubmittingRequest ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "AJUKAN AKSES"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button variant="link" onClick={() => router.push("/")} className="text-muted-foreground hover:text-accent text-[10px] uppercase tracking-[0.2em]">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </main>
  );
}
