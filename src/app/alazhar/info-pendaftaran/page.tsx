"use client";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ExternalLink, 
  FileText, 
  School, 
  Wallet, 
  Phone, 
  Instagram, 
  Send, 
  Star, 
  Heart, 
  Sparkles, 
  GraduationCap, 
  Building2,
  CheckCircle2,
  Calendar,
  ClipboardCheck,
  UserPlus
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export default function InfoPendaftaranPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const registrationSteps = [
    {
      title: "Pendaftaran Online",
      desc: "Isi formulir melalui portal PPDB resmi Al-Azhar.",
      icon: <UserPlus className="w-6 h-6" />,
      color: "bg-blue-500/20 text-blue-500"
    },
    {
      title: "Verifikasi Berkas",
      desc: "Tim admin akan memverifikasi dokumen yang diunggah.",
      icon: <ClipboardCheck className="w-6 h-6" />,
      color: "bg-purple-500/20 text-purple-500"
    },
    {
      title: "Ujian Seleksi",
      desc: "Mengikuti tes akademik dan wawancara sesuai jadwal.",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-pink-500/20 text-pink-500"
    },
    {
      title: "Pengumuman",
      desc: "Hasil seleksi akan diumumkan melalui dashboard PPDB.",
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: "bg-emerald-500/20 text-emerald-500"
    }
  ];

  const contactPersons = [
    {
      unit: "Pondok Pesantren Al-Azhar Purwakarta",
      name: "Ust. Cecep Rahmat",
      phone: "081289852035",
      link: "https://wa.me/6281289852035",
      color: "from-yellow-500/20 to-amber-500/20",
      border: "border-yellow-500/30",
      textColor: "text-yellow-500",
      icon: <Building2 className="w-5 h-5" />,
      tag: "Utama / Kepondokan",
      note: "Khusus Boarding (Mondok)"
    },
    {
      unit: "MA Unggulan Al-Azhar Purwakarta",
      name: "Ust. Ahmad Riki",
      phone: "083197530389",
      link: "https://wa.me/6283197530389",
      color: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/30",
      textColor: "text-emerald-500",
      icon: <GraduationCap className="w-5 h-5" />,
      tag: "Mondok & Non-Mondok",
      note: "Madrasah Aliyah swasta"
    },
    {
      unit: "SMP Islam Al-Azhar Purwakarta",
      name: "Ust. Muh. Husein",
      phone: "081274156718",
      link: "https://wa.me/6281274156718",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
      textColor: "text-blue-500",
      icon: <School className="w-5 h-5" />,
      tag: "Mondok & Non-Mondok",
      note: "Sekolah Menengah Pertama"
    },
    {
      unit: "SDIT Al-Azhar Purwakarta",
      name: "Ustzh. Elisa Setiawati",
      phone: "0895337729417",
      link: "https://wa.me/62895337729417",
      color: "from-orange-500/20 to-red-500/20",
      border: "border-orange-500/30",
      textColor: "text-orange-500",
      icon: <Sparkles className="w-5 h-5" />,
      tag: "Mondok & Non-Mondok",
      note: "Sekolah Dasar Islam Terpadu"
    },
    {
      unit: "TKIT Al-Azhar Purwakarta",
      name: "Segera Hadir",
      phone: "-",
      link: "#",
      color: "from-pink-500/10 to-rose-500/10",
      border: "border-pink-500/20",
      textColor: "text-pink-400",
      icon: <Heart className="w-5 h-5" />,
      tag: "Coming Soon",
      note: "Pendaftaran Tingkat Kanak-Kanak",
      isComingSoon: true
    }
  ];

  return (
    <main className="min-h-screen bg-background overflow-hidden pb-40 relative">
      <Navbar />
      
      {/* Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px]" 
        />
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 md:px-6 py-12 md:py-20 pt-28 md:pt-32 max-w-6xl relative z-10"
      >
        {/* Header Section */}
        <motion.header variants={itemVariants} className="mb-12 md:mb-20 text-center space-y-4 md:space-y-6">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-accent/10 text-accent mb-2 md:mb-4 relative group cursor-default"
          >
            <School className="w-10 h-10 md:w-14 md:h-14 relative z-10 drop-shadow-[0_0_10px_rgba(26,204,230,0.5)]" />
            <div className="absolute inset-0 bg-accent/20 rounded-[1.5rem] md:rounded-[2rem] blur-xl group-hover:blur-2xl transition-all" />
            <motion.div 
              animate={{ y: [0, -5, 0], rotate: [12, 15, 12] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-3 -right-3 bg-yellow-500 text-black px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[11px] font-bold shadow-xl z-20"
            >
              PPDB 2026
            </motion.div>
          </motion.div>
          
          <h1 className="text-3xl md:text-7xl font-headline font-bold tracking-tight leading-tight">
            Masa Depan <span className="text-accent italic">Rabbani</span> <br className="hidden md:block"/>
            Mulai dari <span className="relative inline-block">
              Sini.
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-1 md:bottom-2 left-0 h-2 md:h-3 bg-accent/20 -z-10 rounded-full" 
              />
            </span> ✨
          </h1>
          <p className="text-muted-foreground text-sm md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Bergabunglah dengan Keluarga Besar Pondok Pesantren Al-Azhar. <br className="hidden md:block"/>
            Mencetak generasi Hafidz yang cerdas, berakhlak mulia, dan kompetitif.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          
          {/* Timeline / Flow Section */}
          <div className="lg:col-span-12">
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="flex flex-col items-center gap-2 mb-6 md:mb-10">
                <Badge variant="outline" className="px-3 md:px-4 py-1 border-accent/30 text-accent text-[8px] md:text-xs uppercase tracking-widest font-bold">Registration Flow</Badge>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">Langkah Mudah Mendaftar</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 relative">
                {/* Connector line for desktop */}
                <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent -z-10" />
                
                {registrationSteps.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="glass-card p-5 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 text-center space-y-3 md:space-y-4 hover:border-accent/30 transition-all group"
                  >
                    <div className={cn("mx-auto w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", step.color)}>
                      {step.icon}
                    </div>
                    <div className="space-y-1 md:space-y-2">
                      <h3 className="font-bold text-base md:text-lg text-white">{step.title}</h3>
                      <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Registration Main Card */}
          <div className="lg:col-span-12">
            <motion.div variants={itemVariants}>
              <Card className="glass-card border-white/10 overflow-hidden relative group hover:border-accent/20 transition-all duration-700 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                <CardContent className="p-6 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 text-center lg:text-left">
                  <div className="space-y-4 md:space-y-6 max-w-xl">
                    <div className="flex justify-center lg:justify-start">
                      <div className="p-3 bg-accent/20 rounded-2xl text-accent"><Sparkles className="animate-pulse" /></div>
                    </div>
                    <h2 className="text-2xl md:text-5xl font-headline font-bold leading-tight">
                      Siap Jadi Bagian dari <br className="hidden md:block"/> Generasi Rabbani?
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground font-light">
                      Pendaftaran telah dibuka! Jangan lewatkan kesempatan emas untuk menimba ilmu di lingkungan yang Islami dan modern.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2 md:pt-4">
                      <Button size="lg" className="h-14 md:h-16 px-6 md:px-10 rounded-2xl bg-accent text-background hover:bg-accent/90 shadow-[0_10px_30px_rgba(26,204,230,0.3)] hover:scale-105 transition-all text-base md:text-lg font-bold gap-3 group/btn w-full sm:w-auto" asChild>
                        <Link href="https://alazharpwk.cazh.id/ppdb/ponpes-al-azhar-purwakarta" target="_blank">
                          <ExternalLink size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /> DAFTAR ONLINE SEKARANG
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative w-full lg:w-[400px] aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
                    <img 
                      src="https://picsum.photos/seed/school-register/800/800" 
                      alt="Banner Registration"
                      className="object-cover w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700 scale-110 hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 p-4 glass-card border-white/20 rounded-2xl text-center">
                      <p className="text-accent font-bold text-sm tracking-widest uppercase mb-1">Coming This Month</p>
                      <p className="text-white text-xs font-medium">Gelombang Pertama Terbatas!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Cost Section */}
          <div className="lg:col-span-5">
            <motion.div variants={itemVariants} className="h-full">
              <Card className="glass-card border-white/5 h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-6 md:p-8 pb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-4">
                    <Wallet size={24} />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-headline font-bold">Investasi Masa Depan 💰</CardTitle>
                  <CardDescription className="text-sm md:text-base">Membangun kualitas pendidikan & karakter terbaik.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-0 space-y-6 md:space-y-8">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { label: "Infaq Pendidikan", value: "1.500.000" },
                        { label: "Sewa Lemari & Ranjang", value: "600.000" },
                        { label: "Kasur & Seragam", value: "1.400.000" },
                        { label: "Infaq Bangunan", value: "1.500.000" },
                        { label: "Buku (2 Semester)", value: "800.000" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group transition-all hover:translate-x-1">
                          <span className="text-xs md:text-sm text-white/50 group-hover:text-white/80 transition-colors">{item.label}</span>
                          <span className="font-mono text-xs md:text-sm text-white/80 font-bold">Rp {item.value}</span>
                        </div>
                      ))}
                      
                      <div className="mt-6 md:mt-8 p-5 md:p-6 rounded-2xl md:rounded-3xl bg-accent/10 border border-accent/20 flex flex-col items-center gap-1 md:gap-2 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 italic font-bold">TOTAL</div>
                        <span className="text-[9px] md:text-[10px] text-accent font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Total Biaya Masuk</span>
                        <span className="text-3xl md:text-4xl font-headline font-bold text-white tracking-tight drop-shadow-sm">Rp 5.800.000</span>
                        <div className="flex gap-1 mt-1 md:mt-2">
                           <span className="w-1 h-1 rounded-full bg-accent/40" />
                           <span className="w-10 h-1 rounded-full bg-accent/40" />
                           <span className="w-1 h-1 rounded-full bg-accent/40" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 space-y-1 md:space-y-2">
                    <p className="font-bold text-accent text-[10px] uppercase tracking-widest text-center">Iuran Bulanan (SPP)</p>
                    <div className="flex justify-center items-baseline gap-1 md:gap-2">
                      <span className="text-xl md:text-2xl font-bold text-white">Rp 1.200.000</span>
                      <span className="text-[9px] md:text-[10px] text-white/40 font-medium">/ BULAN</span>
                    </div>
                    <p className="text-[8px] md:text-[10px] text-white/30 italic text-center">* Termasuk Makan 3x Sehari, Laundry, & Fasilitas</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-7">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="p-2.5 md:p-3 bg-accent/20 rounded-xl md:rounded-2xl text-accent"><Phone size={24} /></div>
                <h2 className="text-2xl md:text-3xl font-headline font-bold">Konsultasi dengan Admin 📱</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactPersons.map((contact, idx) => (
                  <motion.a
                    key={idx}
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={contact.isComingSoon ? { scale: 1.01 } : { scale: 1.02, y: -4 }}
                    whileTap={contact.isComingSoon ? {} : { scale: 0.98 }}
                    className={cn(
                      "group relative overflow-hidden glass-card p-5 md:p-6 border rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between h-52 md:h-56 transition-all duration-300",
                      contact.border,
                      contact.isComingSoon ? "opacity-70 cursor-not-allowed grayscale-[0.5]" : "hover:shadow-xl hover:shadow-black/20"
                    )}
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity", contact.color)} />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className={cn("p-2 rounded-xl bg-white/5", contact.textColor)}>
                          {contact.icon}
                        </div>
                        <Badge variant={contact.isComingSoon ? "secondary" : "outline"} className={cn("text-[7px] md:text-[8px] font-bold border-white/10", contact.textColor)}>
                          {contact.tag}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-white text-sm md:text-base leading-snug mb-1 md:mb-2 group-hover:text-white transition-colors">
                        {contact.unit}
                      </h3>
                      <p className="text-white/40 text-[9px] md:text-[10px] group-hover:text-white/60 transition-colors uppercase tracking-widest font-bold">{contact.note}</p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[8px] md:text-[9px] uppercase text-white/40 font-bold mb-0.5">Contact: {contact.phone}</span>
                        <span className="text-xs font-bold text-white tracking-wide">{contact.name}</span>
                        {!contact.isComingSoon && (
                          <motion.span 
                            className="text-[8px] md:text-[9px] font-bold text-accent mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                          >
                            Klik disini untuk chat WA →
                          </motion.span>
                        )}
                      </div>
                      <div className={cn("w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-background shadow-lg transition-transform", !contact.isComingSoon && "group-hover:scale-110", contact.color.replace('20', '100'))}>
                        {contact.isComingSoon ? <Calendar size={14} /> : <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      </div>
                    </div>

                    {contact.isComingSoon && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Badge className="bg-white text-black text-[10px] font-bold px-3 py-1.5">COMING SOON!</Badge>
                      </div>
                    )}
                  </motion.a>
                ))}
              </div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="mt-8 md:mt-10 bg-accent/5 border border-accent/20 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform">
                   <Heart size={200} fill="currentColor" className="text-accent" />
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
                   <Heart className="text-background fill-background" size={32} />
                </div>
                <div className="text-center md:text-left relative z-10">
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Masih Bingung?</h4>
                  <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                    Jangan sungkan untuk bertanya. Kami di sini untuk membantu Akang & Teteh memberikan yang terbaik bagi putra-putri tercinta. ❤️
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </motion.div>
      
      {/* Scroll indicator decor */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-20 hidden md:block">
        <div className="w-[1px] h-20 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </main>
  );
}

const Badge = ({ children, variant = "outline", className }: { children: React.ReactNode, variant?: string, className?: string }) => (
  <span className={cn(
    "px-2 py-0.5 rounded-full border text-[10px] font-bold",
    variant === "outline" ? "bg-white/5 border-white/10" : "bg-accent text-background",
    className
  )}>
    {children}
  </span>
);

