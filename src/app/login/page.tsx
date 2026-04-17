
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
import { Loader2, Lock, Eye, EyeOff, UserPlus, Clock, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [requestStatus, setRequestStatus] = useState<'idle' | 'pending' | 'approved' | 'rejected' | 'account_exists'>('idle');
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (user && !authLoading) {
      router.push("/admin/dashboard");
    }
  }, [user, authLoading, router]);

  // Check localStorage for previous requests on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("pending-request-email");
    if (savedEmail) {
      checkExistingRequest(savedEmail);
    }
  }, []);

  const checkExistingRequest = async (requestedEmail: string) => {
    try {
      // 1. Check if account already exists in admins table
      const { data: adminData } = await supabase
        .from('admins')
        .select('role')
        .eq('email', requestedEmail)
        .single();
      
      if (adminData) {
        setRequestStatus('account_exists');
        setStatusMessage(`Akun sudah aktif sebagai ${adminData.role}. Silakan login.`);
        return;
      }

      // 2. Check for pending request
      const { data: reqData } = await supabase
        .from('requests')
        .select('status')
        .eq('requested_by', requestedEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (reqData) {
        setRequestStatus(reqData.status as any);
        if (reqData.status === 'pending') {
          setStatusMessage("Permintaan Anda sedang ditinjau oleh Admin Utama.");
        } else if (reqData.status === 'rejected') {
          setStatusMessage("Maaf, permintaan akses Anda tidak dapat kami setujui saat ini.");
        }
      }
    } catch (err) {
      console.error("Status check error:", err);
    }
  };

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

      // Store in localStorage for persistence across refersh
      localStorage.setItem("pending-request-email", requestData.email);
      setRequestStatus('pending');
      setStatusMessage("Permintaan Anda sedang ditinjau oleh Admin Utama.");

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
                  {requestStatus === 'idle' 
                    ? "Isi data di bawah untuk mengajukan akun pengelola konten De Seviore."
                    : "Status permintaan akses Anda."}
                </DialogDescription>
              </DialogHeader>

              {requestStatus !== 'idle' ? (
                <div className="space-y-6 py-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {requestStatus === 'pending' && <Clock className="w-12 h-12 text-amber-500 animate-pulse" />}
                    {requestStatus === 'approved' && <CheckCircle2 className="w-12 h-12 text-emerald-500" />}
                    {requestStatus === 'rejected' && <AlertCircle className="w-12 h-12 text-red-500" />}
                    {requestStatus === 'account_exists' && <UserPlus className="w-12 h-12 text-accent" />}
                    
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg uppercase tracking-tight">
                        {requestStatus === 'pending' ? "Sedang Ditinjau" : 
                         requestStatus === 'approved' ? "Akses Disetujui" :
                         requestStatus === 'rejected' ? "Permintaan Ditolak" : "Akun Sudah Aktif"}
                      </h3>
                      <p className="text-xs text-muted-foreground px-4">
                        {statusMessage}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10"
                      onClick={() => {
                        const saved = localStorage.getItem("pending-request-email");
                        if (saved) checkExistingRequest(saved);
                      }}
                    >
                      <RefreshCw size={14} className="mr-2" /> Segarkan Status
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-[10px] uppercase opacity-50"
                      onClick={() => {
                        localStorage.removeItem("pending-request-email");
                        setRequestStatus('idle');
                      }}
                    >
                      Gunakan Email Lain
                    </Button>
                  </div>
                </div>
              ) : (
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
                  <Button type="submit" className="w-full bg-accent text-background font-bold tracking-widest mt-6" disabled={isSubmittingRequest}>
                    {isSubmittingRequest ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "AJUKAN AKSES"}
                  </Button>
                </form>
              )}
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
