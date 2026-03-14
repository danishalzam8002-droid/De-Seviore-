
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, Users, BookOpen, Video, Loader2 } from "lucide-react";
import { QuoteGenerator } from "@/components/QuoteGenerator";
import { toast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("members");
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  
  const [members, setMembers] = useState<any[]>([]);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [newMember, setNewMember] = useState({ name: "", pob: "", dob: "", phone: "", ig: "", quote: "" });

  const [batchContent, setBatchContent] = useState({
    history: "Didirikan pada tahun 2021, angkatan kami telah melewati berbagai tantangan...",
    philosophy: "Nama De'Seviore melambangkan 'Pelayan Kebijaksanaan'...",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast({ title: "Dihapus", description: "Anggota telah dihapus dari direktori." });
  };

  const handleSaveMember = () => {
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? editingMember : m));
      setEditingMember(null);
      toast({ title: "Diperbarui", description: "Profil anggota berhasil disimpan." });
    } else {
      setMembers([...members, { ...newMember, id: Date.now().toString() }]);
      setNewMember({ name: "", pob: "", dob: "", phone: "", ig: "", quote: "" });
      toast({ title: "Ditambahkan", description: "Anggota baru berhasil didaftarkan." });
    }
  };

  const handleUpdateBatchContent = () => {
    // Di sini nantinya akan menggunakan setDoc ke Firestore
    toast({ title: "Berhasil", description: "Konten angkatan telah diperbarui." });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen pb-32">
      <Navbar />
      
      <div className="container mx-auto px-6 py-20">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold accent-glow">Konsol Admin</h1>
            <p className="text-muted-foreground text-lg mt-2">Kelola warisan dan anggota De'Seviore.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">Ekspor Data</Button>
            <Button className="bg-accent text-background hover:bg-accent/80">Publikasi Perubahan</Button>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-card border border-white/10 p-1 w-full md:w-auto">
            <TabsTrigger value="members" className="data-[state=active]:bg-accent data-[state=active]:text-background">
              <Users className="w-4 h-4 mr-2" /> Anggota
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-accent data-[state=active]:text-background">
              <BookOpen className="w-4 h-4 mr-2" /> Info Angkatan
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-accent data-[state=active]:text-background">
              <ImageIcon className="w-4 h-4 mr-2" /> Galeri
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>{editingMember ? "Ubah Anggota" : "Tambah Anggota"}</CardTitle>
                  <CardDescription>Masukkan rincian biografi individu.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input 
                      value={editingMember ? editingMember.name : newMember.name}
                      onChange={(e) => editingMember ? setEditingMember({...editingMember, name: e.target.value}) : setNewMember({...newMember, name: e.target.value})}
                      className="bg-background/50" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tempat Lahir</Label>
                      <Input 
                        value={editingMember ? editingMember.pob : newMember.pob}
                        onChange={(e) => editingMember ? setEditingMember({...editingMember, pob: e.target.value}) : setNewMember({...newMember, pob: e.target.value})}
                        className="bg-background/50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Lahir</Label>
                      <Input 
                        type="date"
                        value={editingMember ? editingMember.dob : newMember.dob}
                        onChange={(e) => editingMember ? setEditingMember({...editingMember, dob: e.target.value}) : setNewMember({...newMember, dob: e.target.value})}
                        className="bg-background/50" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Telepon</Label>
                    <Input 
                      value={editingMember ? editingMember.phone : newMember.phone}
                      onChange={(e) => editingMember ? setEditingMember({...editingMember, phone: e.target.value}) : setNewMember({...newMember, phone: e.target.value})}
                      className="bg-background/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username Instagram</Label>
                    <Input 
                      value={editingMember ? editingMember.ig : newMember.ig}
                      onChange={(e) => editingMember ? setEditingMember({...editingMember, ig: e.target.value}) : setNewMember({...newMember, ig: e.target.value})}
                      placeholder="@username"
                      className="bg-background/50" 
                    />
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <Label>Kutipan Pribadi ('Kata-kata')</Label>
                    <QuoteGenerator 
                      onQuoteGenerated={(quote) => {
                        editingMember 
                          ? setEditingMember({...editingMember, quote}) 
                          : setNewMember({...newMember, quote});
                      }} 
                    />
                    <Textarea 
                      value={editingMember ? editingMember.quote : newMember.quote}
                      onChange={(e) => editingMember ? setEditingMember({...editingMember, quote: e.target.value}) : setNewMember({...newMember, quote: e.target.value})}
                      className="bg-background/50 h-24 mt-2"
                      placeholder="Masukkan kutipan atau buat dengan AI di atas..."
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveMember} className="flex-1 bg-accent text-background font-bold">
                      <Save className="w-4 h-4 mr-2" /> Simpan Anggota
                    </Button>
                    {editingMember && (
                      <Button variant="outline" onClick={() => setEditingMember(null)} className="border-white/10">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card md:col-span-2">
                <CardHeader>
                  <CardTitle>Direktori Anggota</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-accent">Nama</TableHead>
                        <TableHead className="text-accent">Kontak</TableHead>
                        <TableHead className="text-accent text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((m) => (
                        <TableRow key={m.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-bold">{m.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {m.phone}<br/>{m.ig}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost" onClick={() => setEditingMember(m)} className="h-8 w-8 hover:text-accent">
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteMember(m.id)} className="h-8 w-8 hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {members.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Belum ada anggota terdaftar.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="glass-card max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Lore, Nilai & Media Angkatan</CardTitle>
                <CardDescription>Perbarui sejarah, filosofi, dan video trailer yang ditampilkan di halaman beranda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Teks Sejarah</Label>
                  <Textarea 
                    value={batchContent.history}
                    onChange={(e) => setBatchContent({...batchContent, history: e.target.value})}
                    className="bg-background/50 h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teks Filosofi</Label>
                  <Textarea 
                    value={batchContent.philosophy}
                    onChange={(e) => setBatchContent({...batchContent, philosophy: e.target.value})}
                    className="bg-background/50 h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-accent" />
                    URL Video Trailer (Embed YouTube)
                  </Label>
                  <Input 
                    value={batchContent.videoUrl}
                    onChange={(e) => setBatchContent({...batchContent, videoUrl: e.target.value})}
                    placeholder="Contoh: https://www.youtube.com/embed/XXXXXX"
                    className="bg-background/50"
                  />
                  <p className="text-[10px] text-muted-foreground italic">Gunakan link 'Embed' dari YouTube untuk hasil terbaik.</p>
                </div>
                <Button onClick={handleUpdateBatchContent} className="w-full bg-accent text-background font-bold">
                  Perbarui Konten Angkatan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="aspect-square border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer group">
                <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold uppercase">Unggah Media</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
