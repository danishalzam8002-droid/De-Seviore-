"use client";

import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-supabase-user";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, Users, BookOpen, Video, Loader2, Key, Upload, Camera, CheckCircle2 } from "lucide-react";
import { QuoteGenerator } from "@/components/QuoteGenerator";
import { UsageMonitor } from "@/components/admin/UsageMonitor";
import { toast } from "@/hooks/use-toast";
import { Activity } from "lucide-react";



function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("members");
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [albumItems, setAlbumItems] = useState<any[]>([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [newAlbum, setNewAlbum] = useState({ title: "", driveLink: "", imageUrl: "" });
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", pob: "", dob: "", phone: "", ig: "", quote: "", role: "Anggota", image_url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMemberFile, setSelectedMemberFile] = useState<File | null>(null);
  const [memberPreviewUrl, setMemberPreviewUrl] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const [kitabs, setKitabs] = useState<any[]>([]);
  const [newKitab, setNewKitab] = useState({ title: "", author: "", category: "Fiqih", file_url: "" });

  const [adminRoles, setAdminRoles] = useState<any[]>([]);
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", role: "Moderator" });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const currentUserRole = adminRoles.find(a => a.email === user?.email)?.role;

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch Kitab
        const { data: kitabData } = await supabase.from('kitab').select('*');
        setKitabs(kitabData || []);

        // Fetch Admins
        const { data: adminData } = await supabase.from('admins').select('*');
        setAdminRoles(adminData || []);

        // Fetch Members
        const { data: memberData } = await supabase.from('members').select('*');
        setMembers(memberData || []);

        // Fetch Batch Info
        const { data: batchData } = await supabase.from('batch_info').select('*').single();
        if (batchData) {
          setBatchContent(batchData as any);
        }

        // Fetch Gallery
        const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        setGalleryItems(galleryData || []);

        // Fetch Albums
        const { data: albumData } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
        setAlbumItems(albumData || []);

      } catch (e: any) {
        console.error("Supabase Fetch Error:", e);
        toast({
          title: "Fetch Error",
          description: "Terjadi kesalahan saat mengambil data dari Supabase.",
          variant: "destructive"
        });
      }
    };
    fetchAllData();
  }, []);

  const [batchContent, setBatchContent] = useState({
    history: "Didirikan pada tahun 2021, angkatan kami telah melewati berbagai tantangan...",
    philosophy: "Nama De Seviore melambangkan 'Pelayan Kebijaksanaan'...",
    videoUrl: "https://www.youtube.com/embed/ZVAhEWgkl1g?autoplay=1&mute=1",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(blob || file);
          }, 'image/jpeg', 0.8);
        };
      };
    });
  };

  const resetMemberStates = () => {
    setSelectedMemberFile(null);
    setMemberPreviewUrl("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadStatus('idle');
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== id));
      toast({ title: "Dihapus", description: "Anggota telah dihapus dari direktori." });
    } catch (e) {
      console.error(e);
      toast({ title: "Gagal", description: "Gagal menghapus anggota.", variant: "destructive" });
    }
  };

  const handleSaveMember = async () => {
    setConfirmModal({
      open: true,
      title: "Konfirmasi Simpan",
      description: `Apakah Anda yakin ingin menyimpan dan mengunggah data anggota "${editingMember ? editingMember.name : newMember.name}" ke database?`,
      onConfirm: async () => {
        try {
          let imageUrl = editingMember ? editingMember.image_url : newMember.image_url;

          // 1. Handle image upload if a file was selected
          if (selectedMemberFile) {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
            
            if (!cloudName || !uploadPreset) {
              toast({ title: "Konfigurasi Error", description: "Cloudinary belum dikonfigurasi.", variant: "destructive" });
              return;
            }

            setIsUploading(true);
            setUploadStatus('uploading');
            setUploadProgress(10);

            // COMPRESSION STEP
            const compressedBlob = await compressImage(selectedMemberFile);
            setUploadProgress(30);

            const formData = new FormData();
            formData.append("file", compressedBlob);
            formData.append("upload_preset", uploadPreset);
            formData.append("folder", "members");

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
              { method: "POST", body: formData }
            );

            if (!response.ok) throw new Error("Gagal mengunggah foto profil.");
            const uploadData = await response.json();
            imageUrl = uploadData.secure_url;
            setUploadProgress(80);
          }

          // 2. Save member data to Supabase
          const memberPayload = {
            name: editingMember ? editingMember.name : newMember.name,
            pob: editingMember ? editingMember.pob : newMember.pob,
            dob: editingMember ? editingMember.dob : newMember.dob,
            phone: editingMember ? editingMember.phone : newMember.phone,
            ig: editingMember ? editingMember.ig : newMember.ig,
            quote: editingMember ? editingMember.quote : newMember.quote,
            role: editingMember ? editingMember.role : newMember.role,
            image_url: imageUrl
          };

          if (editingMember) {
            const { error } = await supabase
              .from('members')
              .update(memberPayload)
              .eq('id', editingMember.id);
            
            if (error) throw error;
            
            setMembers(members.map(m => m.id === editingMember.id ? { ...m, ...memberPayload } : m));
            setEditingMember(null);
            setIsEditModalOpen(false);
          } else {
            const { data, error } = await supabase
              .from('members')
              .insert([memberPayload])
              .select()
              .single();
            
            if (error) throw error;
            
            if (data) {
              setMembers([...members, data]);
            }
            setNewMember({ name: "", pob: "", dob: "", phone: "", ig: "", quote: "", role: "Anggota", image_url: "" });
          }
          
          setUploadProgress(100);
          setUploadStatus('success');
          toast({ title: "Berhasil", description: "Data anggota telah terbit di Intrada Page." });

        } catch (e: any) {
          console.error(e);
          toast({ title: "Error", description: e.message || "Gagal menyimpan data.", variant: "destructive" });
          setIsUploading(false);
          setUploadStatus('idle');
          setUploadProgress(0);
        }
      }
    });
  };

  const handleUpdateBatchContent = async () => {
    setConfirmModal({
      open: true,
      title: "Konfirmasi Pembaruan",
      description: "Anda akan memperbarui Sejarah, Filosofi, dan Video Angkatan. Lanjutkan?",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('batch_info')
            .upsert({ id: 1, ...batchContent });
          
          if (error) throw error;
          
          toast({ title: "Berhasil", description: "Konten angkatan telah diperbarui." });
        } catch(e) {
          console.error(e);
          toast({ title: "Error", description: "Gagal memperbarui konten angkatan.", variant: "destructive" });
        }
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'member' | 'gallery' = 'member') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'member') {
      setSelectedMemberFile(file);
      const preview = URL.createObjectURL(file);
      setMemberPreviewUrl(preview);
      toast({ title: "Foto Dipilih", description: "Foto profil siap untuk diunggah saat Anda menyimpan." });
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast({ title: "Konfigurasi Error", description: "Cloudinary belum dikonfigurasi dengan benar.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    const folder = type === 'gallery' ? 'gallery' : 'albums';
    formData.append("folder", folder);

    if (type === 'gallery') {
      setConfirmModal({
        open: true,
        title: "Unggah Momen",
        description: `Anda akan mengunggah foto "${file.name}" dengan judul "${galleryTitle || "Momen Seviore"}" ke Galeri Publik. Lanjutkan?`,
        onConfirm: () => startUpload(formData, type)
      });
    } else {
      startUpload(formData, type as any);
    }
  };

  const startUpload = async (formData: FormData, type: 'member' | 'gallery' | 'album' = 'member') => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    try {
      setIsUploading(true);
      setUploadProgress(10);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Gagal mengunggah ke Cloudinary");

      const data = await response.json();
      const downloadURL = data.secure_url;
      
      setUploadProgress(100);

      if (type === 'member') {
        if (editingMember) {
          setEditingMember({ ...editingMember, image_url: downloadURL });
        } else {
          setNewMember({ ...newMember, image_url: downloadURL });
        }
        toast({ title: "Berhasil", description: "Foto profil berhasil diunggah." });
      } else      if (type === 'gallery') {
        // Add to gallery collection
        const newItem = { 
          image_url: downloadURL, 
          title: galleryTitle || "Momen Seviore",
          created_at: new Date().toISOString()
        };
        const { data, error } = await supabase.from('gallery').insert([newItem]).select().single();
        if (error) throw error;
        
        if (data) {
          setGalleryItems([...galleryItems, data]);
          setGalleryTitle(""); // Clear title after upload
          toast({ title: "Berhasil", description: "Gambar ditambahkan ke galeri." });
        }
      }
 else if ((type as string) === 'album') {
        setNewAlbum(prev => ({ ...prev, imageUrl: downloadURL }));
        toast({ title: "Berhasil", description: "Cover album berhasil diunggah." });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Gagal", description: "Gagal mengunggah gambar ke Cloudinary.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddAlbum = async () => {
    if (!newAlbum.title || !newAlbum.imageUrl || !newAlbum.driveLink) {
      toast({ title: "Peringatan", description: "Mohon lengkapi semua data album.", variant: "destructive" });
      return;
    }

    setConfirmModal({
      open: true,
      title: "Konfirmasi Album",
      description: `Apakah Anda yakin ingin menambahkan album "${newAlbum.title}" ke koleksi?`,
      onConfirm: async () => {
        try {
          const albumPayload = {
            title: newAlbum.title,
            image_url: newAlbum.imageUrl,
            drive_link: newAlbum.driveLink,
            created_at: new Date().toISOString()
          };
          const { data, error } = await supabase.from('albums').insert([albumPayload]).select().single();
          if (error) throw error;

          if (data) {
            setAlbumItems([...albumItems, data]);
            setNewAlbum({ title: "", driveLink: "", imageUrl: "" });
            toast({ title: "Berhasil", description: "Album kenangan berhasil ditambahkan." });
          }
        } catch (e) {
          console.error(e);
          toast({ title: "Error", description: "Gagal menyimpan album.", variant: "destructive" });
        }
      }
    });
  };

  const handleDeleteAlbum = async (id: string) => {
    try {
      const { error } = await supabase.from('albums').delete().eq('id', id);
      if (error) throw error;
      setAlbumItems(albumItems.filter(a => a.id !== id));
      toast({ title: "Berhasil", description: "Album telah dihapus." });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      setGalleryItems(galleryItems.filter(item => item.id !== id));
      toast({ title: "Dihapus", description: "Gambar telah dihapus dari galeri." });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveKitab = async () => {
    if (!newKitab.title || !newKitab.file_url) {
      toast({ title: "Gagal", description: "Judul dan Tautan File wajib diisi.", variant: "destructive" });
      return;
    }
    setConfirmModal({
      open: true,
      title: "Tambah Kitab",
      description: `Ingin mengunggah kitab "${newKitab.title}" ke perpustakaan digital?`,
      onConfirm: async () => {
        try {
          const kitabPayload = {
            title: newKitab.title,
            author: newKitab.author,
            category: newKitab.category,
            file_url: newKitab.file_url
          };
          const { data, error } = await supabase.from('kitab').insert([kitabPayload]).select().single();
          if (error) throw error;
          
          if (data) {
            setKitabs([...kitabs, data]);
          }
          setNewKitab({ title: "", author: "", category: "Fiqih", file_url: "" });
          toast({ title: "Ditambahkan", description: "Kitab baru berhasil diunggah." });
        } catch (e) {
          console.error(e);
          toast({ title: "Error", description: "Gagal mengunggah kitab.", variant: "destructive" });
        }
      }
    });
  };

  const handleDeleteKitab = async (id: string) => {
    try {
      const { error } = await supabase.from('kitab').delete().eq('id', id);
      if (error) throw error;
      setKitabs(kitabs.filter(k => k.id !== id));
      toast({ title: "Dihapus", description: "Kitab telah dihapus dari perpustakaan." });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password) {
      toast({ title: "Gagal", description: "Email dan kata sandi wajib diisi.", variant: "destructive" });
      return;
    }

    setConfirmModal({
      open: true,
      title: "Tambah Akses Admin",
      description: `Apakah Anda yakin ingin memberikan hak akses admin kepada "${newAdmin.email}"?`,
      onConfirm: async () => {
        setIsCreatingAdmin(true);
        try {
          // 1. Create User in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: newAdmin.email,
            password: newAdmin.password,
          });

          if (authError) throw authError;

          // 2. Store Role in Supabase
          const { data: roleData, error: roleError } = await supabase
            .from('admins')
            .insert([{ email: newAdmin.email, role: newAdmin.role }])
            .select()
            .single();
          
          if (roleError) throw roleError;

          if (roleData) {
            setAdminRoles([...adminRoles, roleData]);
          }

          setNewAdmin({ email: "", password: "", role: "Moderator" });
          toast({ title: "Akses Ditambahkan", description: "Admin baru berhasil didaftarkan." });
        } catch (error: any) {
          console.error(error);
          toast({ title: "Gagal Membuat Akses", description: error.message, variant: "destructive" });
        } finally {
          setIsCreatingAdmin(false);
        }
      }
    });
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
            <p className="text-muted-foreground text-lg mt-2">Kelola warisan dan anggota De Seviore.</p>
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
            <TabsTrigger value="albums" className="data-[state=active]:bg-accent data-[state=active]:text-background">
              <Camera className="w-4 h-4 mr-2" /> Album
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-accent data-[state=active]:text-background">
              <BookOpen className="w-4 h-4 mr-2" /> Perpustakaan
            </TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-accent data-[state=active]:text-background">
              <Key className="w-4 h-4 mr-2" /> Akses Login
            </TabsTrigger>
            {currentUserRole === 'Admin' && (
              <TabsTrigger value="monitoring" className="data-[state=active]:bg-accent data-[state=active]:text-background">
                <Activity className="w-4 h-4 mr-2" /> Monitoring
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="members" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>{editingMember ? "Ubah Anggota" : "Tambah Anggota"}</CardTitle>
                  <CardDescription>Masukkan rincian biografi individu.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nama Lengkap</Label>
                      <Input
                        value={editingMember ? editingMember.name : newMember.name}
                        onChange={(e) => editingMember ? setEditingMember({ ...editingMember, name: e.target.value }) : setNewMember({ ...newMember, name: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Peran</Label>
                      <Select
                        value={editingMember ? editingMember.role || "Anggota" : newMember.role}
                        onValueChange={(value) => editingMember ? setEditingMember({ ...editingMember, role: value }) : setNewMember({ ...newMember, role: value })}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Pilih Peran" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Anggota">Anggota</SelectItem>
                          <SelectItem value="Ketua">Ketua</SelectItem>
                          <SelectItem value="Pengajar">Pengajar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tempat Lahir</Label>
                      <Input
                        value={editingMember ? editingMember.pob : newMember.pob}
                        onChange={(e) => editingMember ? setEditingMember({ ...editingMember, pob: e.target.value }) : setNewMember({ ...newMember, pob: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Lahir</Label>
                      <Input
                        type="date"
                        value={editingMember ? editingMember.dob : newMember.dob}
                        onChange={(e) => editingMember ? setEditingMember({ ...editingMember, dob: e.target.value }) : setNewMember({ ...newMember, dob: e.target.value })}
                        className="bg-background/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Telepon</Label>
                    <Input
                      value={editingMember ? editingMember.phone : newMember.phone}
                      onChange={(e) => editingMember ? setEditingMember({ ...editingMember, phone: e.target.value }) : setNewMember({ ...newMember, phone: e.target.value })}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Username Instagram</Label>
                    <Input
                      value={editingMember ? editingMember.ig : newMember.ig}
                      onChange={(e) => editingMember ? setEditingMember({ ...editingMember, ig: e.target.value }) : setNewMember({ ...newMember, ig: e.target.value })}
                      placeholder="@username"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Label>Foto Profil</Label>
                    <div className="flex items-center gap-4">
                      { (newMember.image_url) && (
                        <div className="relative group/img">
                          <img 
                            src={newMember.image_url} 
                            alt="Profile Preview" 
                            className="w-16 h-16 rounded-full object-cover border border-white/20" 
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewMember({ ...newMember, image_url: "" });
                            }}
                            className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                            title="Batalkan / Hapus Foto"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex items-center justify-center gap-2 border border-dashed border-white/20 p-4 rounded-md hover:bg-white/5 transition-colors">
                            <Upload className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium">
                              {selectedMemberFile ? selectedMemberFile.name : "Pilih Foto untuk Profil"}
                            </span>
                          </div>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'member')}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <Label>Kutipan Pribadi ('Kata-kata')</Label>
                    <QuoteGenerator
                      onQuoteGenerated={(quote) => {
                        console.log("Setting auto-quote:", quote);
                        setNewMember({ ...newMember, quote });
                      }}
                    />
                    <Textarea
                      value={newMember.quote}
                      onChange={(e) => setNewMember({ ...newMember, quote: e.target.value })}
                      className="bg-background/50 h-24 mt-2"
                      placeholder="Masukkan kutipan atau buat dengan AI di atas..."
                    />
                  </div>

                  <Button onClick={handleSaveMember} className="w-full bg-accent text-background font-bold uppercase tracking-wider py-6 mt-4">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Anggota Baru
                  </Button>
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
                          <TableCell>
                            <div className="font-bold">{m.name}</div>
                            <div className="text-xs text-accent">{m.role || "Anggota"}</div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {m.phone}<br />{m.ig}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => {
                                  setEditingMember(m);
                                  setIsEditModalOpen(true);
                                }} 
                                className="h-8 w-8 hover:text-accent"
                              >
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
                <CardDescription>Perbarui sejarah, filosofi, dan video kenangan yang ditampilkan di halaman beranda.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Teks Sejarah</Label>
                  <Textarea
                    value={batchContent.history}
                    onChange={(e) => setBatchContent({ ...batchContent, history: e.target.value })}
                    className="bg-background/50 h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teks Filosofi</Label>
                  <Textarea
                    value={batchContent.philosophy}
                    onChange={(e) => setBatchContent({ ...batchContent, philosophy: e.target.value })}
                    className="bg-background/50 h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-accent" />
                    URL Video Kenangan (Embed YouTube)
                  </Label>
                  <Input
                    value={batchContent.videoUrl}
                    onChange={(e) => setBatchContent({ ...batchContent, videoUrl: e.target.value })}
                    placeholder="Contoh: https://www.youtube.com/embed/XXXXXX"
                    className="bg-background/50"
                  />
                  <p className="text-[10px] text-muted-foreground italic">Gunakan link 'Embed' dari YouTube untuk hasil terbaik.</p>
                </div>
                <Button onClick={handleUpdateBatchContent} className="w-full bg-accent text-background font-bold uppercase tracking-wider py-6">
                  <Save className="w-5 h-5 mr-2" /> Simpan dan Unggah Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="glass-card max-w-md">
              <CardHeader>
                <CardTitle>Unggah Momen Baru</CardTitle>
                <CardDescription>Beri judul dan pilih foto untuk dibagikan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Judul Momen</Label>
                  <Input
                    placeholder="Contoh: Rapat Angkatan"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="relative aspect-video border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer group overflow-hidden">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'gallery')}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {isUploading ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-accent" />
                      <span className="text-sm font-bold">{Math.round(uploadProgress)}%</span>
                    </div>
                  ) : (
                    <>
                      <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold uppercase">Pilih Foto</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center gap-2">
                    <p className="text-[10px] font-bold text-white uppercase">{item.title}</p>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Hapus foto ini dari galeri?")) {
                          handleDeleteGallery(item.id);
                        }
                      }}
                      className="h-7 px-2 text-[8px] font-bold uppercase tracking-wider"
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="library" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Unggah Kitab</CardTitle>
                  <CardDescription>Tambahkan kitab baru ke perpustakaan online.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Judul Kitab</Label>
                    <Input
                      value={newKitab.title}
                      onChange={(e) => setNewKitab({ ...newKitab, title: e.target.value })}
                      placeholder="Contoh: Safinatun Najah"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Penyusun / Penulis</Label>
                    <Input
                      value={newKitab.author}
                      onChange={(e) => setNewKitab({ ...newKitab, author: e.target.value })}
                      placeholder="Contoh: Syekh Salim bin Sumair"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select value={newKitab.category} onValueChange={(val) => setNewKitab({ ...newKitab, category: val })}>
                      <SelectTrigger className="bg-background/50 border-white/20">
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fiqih">Fiqih</SelectItem>
                        <SelectItem value="Aqidah">Aqidah</SelectItem>
                        <SelectItem value="Akhlaq / Tasawuf">Akhlaq / Tasawuf</SelectItem>
                        <SelectItem value="Tafsir">Tafsir</SelectItem>
                        <SelectItem value="Hadits">Hadits</SelectItem>
                        <SelectItem value="Sejarah / Sirah">Sejarah / Sirah</SelectItem>
                        <SelectItem value="Nahwu / Shorof">Nahwu / Shorof</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tautan File (URL)</Label>
                    <Input
                      value={newKitab.file_url}
                      onChange={(e) => setNewKitab({ ...newKitab, file_url: e.target.value })}
                      placeholder="https://link-ke-file-pdf.com"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="pt-2">
                    <Button onClick={handleSaveKitab} className="w-full bg-accent text-background font-bold uppercase tracking-wider">
                      <Save className="w-4 h-4 mr-2" /> Simpan dan Unggah Kitab
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card md:col-span-2">
                <CardHeader>
                  <CardTitle>Daftar Kitab</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-accent">Informasi Kitab</TableHead>
                        <TableHead className="text-accent">Kategori</TableHead>
                        <TableHead className="text-accent text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kitabs.map((k) => (
                        <TableRow key={k.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <div className="font-bold">{k.title}</div>
                            <div className="text-xs text-muted-foreground">{k.author}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{k.category}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteKitab(k.id)} className="h-8 w-8 hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {kitabs.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Belum ada kitab terdaftar.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="access" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="glass-card md:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle>Beri Akses Admin</CardTitle>
                  <CardDescription>Buat akun login baru (email & password) untuk pengurus lain agar dapat masuk ke konsol ini.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      placeholder="pengurus@domain.com"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kata Sandi</Label>
                    <Input
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Peran / Jabatan Admin</Label>
                    <Select value={newAdmin.role} onValueChange={(val) => setNewAdmin({ ...newAdmin, role: val })}>
                      <SelectTrigger className="bg-background/50 border-white/20">
                        <SelectValue placeholder="Pilih Peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin Utama">Admin Utama</SelectItem>
                        <SelectItem value="Admin Konten">Admin Konten</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="pt-2">
                    <Button
                      onClick={handleCreateAdmin}
                      disabled={isCreatingAdmin}
                      className="w-full bg-accent text-background font-bold uppercase tracking-wider"
                    >
                      {isCreatingAdmin ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      {isCreatingAdmin ? "Menyimpan..." : "Simpan dan Unggah Akses"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card md:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl pointer-events-none">
                  <Key className="w-64 h-64 text-accent" />
                </div>
                <CardHeader className="relative z-10">
                  <CardTitle>Daftar Pengurus Admin</CardTitle>
                  <CardDescription>Daftar akun yang berhak mengakses Konsol Admin ini.</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-accent">User Email</TableHead>
                        <TableHead className="text-accent">Hak Akses / Peran</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminRoles.map((a) => (
                        <TableRow key={a.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-medium text-white">{a.email}</TableCell>
                          <TableCell>
                            <span className="inline-block px-2 py-1 bg-accent/20 text-accent text-xs rounded-md">
                              {a.role}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {adminRoles.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                            Hanya Anda yang tercatat sebagai Admin saat ini (atau tidak ada data sekunder).
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="albums" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Manajemen Album Kenangan</CardTitle>
                <CardDescription>Upload cover album dan masukkan link download dari Google Drive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Judul Album</Label>
                      <Input
                        placeholder="Contoh: Album Perpisahan 2024"
                        value={newAlbum.title}
                        onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link Google Drive</Label>
                      <Input
                        placeholder="https://drive.google.com/..."
                        value={newAlbum.driveLink}
                        onChange={(e) => setNewAlbum({ ...newAlbum, driveLink: e.target.value })}
                        className="bg-background/50 border-white/10"
                      />
                    </div>
                    <Button onClick={handleAddAlbum} className="w-full bg-accent hover:bg-accent/80 text-background font-bold uppercase tracking-wider">
                      Simpan dan Unggah Album
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cover Album</Label>
                    <div className="relative aspect-video border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer group overflow-hidden bg-white/5">
                      {newAlbum.imageUrl ? (
                        <>
                          <img src={newAlbum.imageUrl} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); setNewAlbum({ ...newAlbum, imageUrl: "" }); }} className="h-8">
                              Ganti Foto
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'album' as any)}
                            disabled={isUploading}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          {isUploading ? (
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-accent" />
                              <span className="text-sm font-bold text-accent">{Math.round(uploadProgress)}%</span>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 group-hover:scale-110 transition-transform mb-1" />
                              <span className="text-sm font-bold uppercase">Pilih Cover</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-8 mt-4">
                  <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-accent flex items-center gap-2">
                    <Camera className="w-5 h-5" /> Koleksi Album Terdaftar
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {albumItems.map((album) => (
                      <div key={album.id} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group bg-card shadow-lg">
                        <img src={album.image_url} alt={album.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
                           <p className="text-[10px] font-bold text-white uppercase line-clamp-1 mb-2">
                             {album.title}
                           </p>
                           <div className="flex gap-2">
                             <Button
                               size="icon"
                               variant="outline"
                               onClick={() => window.open(album.drive_link, '_blank')}
                               className="h-7 w-7 rounded-full border-white/20 bg-white/10 text-white hover:bg-accent hover:text-background"
                             >
                               <Upload className="w-3 h-3" />
                             </Button>
                             <Button
                               size="icon"
                               variant="destructive"
                               onClick={() => {
                                 if (confirm("Hapus album ini?")) {
                                   handleDeleteAlbum(album.id);
                                 }
                               }}
                               className="h-7 w-7 rounded-full"
                             >
                               <Trash2 className="w-3 h-3" />
                             </Button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {currentUserRole === 'Admin' && (
            <TabsContent value="monitoring" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <UsageMonitor />
            </TabsContent>
          )}
        </Tabs>
      </div>
      {/* Progress Upload Modal */}
      <AlertDialog open={(isUploading && selectedMemberFile !== null) || uploadStatus === 'success'}>
        <AlertDialogContent className="glass-card border-accent/20 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {uploadStatus === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              )}
              {uploadStatus === 'success' ? "Unggah Berhasil" : "Mengunggah Data"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 pt-4 text-center">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-accent/20">
                  {memberPreviewUrl && <img src={memberPreviewUrl} className="w-full h-full object-cover" alt="Uploading" />}
                  {uploadStatus === 'success' ? (
                    <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center text-white">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-2xl">
                      {Math.round(uploadProgress)}%
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-white">
                    {uploadStatus === 'success' ? "Hapus modal untuk melihat hasil." : "Sedang memproses foto dan data..."}
                  </span>
                  <span className="text-xs text-muted-foreground italic">
                    {uploadStatus === 'success' ? "Data sudah terbit di Intrada Page." : "Mohon jangan tutup halaman ini."}
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          {uploadStatus === 'success' && (
            <AlertDialogFooter>
              <Button 
                onClick={resetMemberStates}
                className="w-full bg-accent hover:bg-accent/80 text-background font-bold"
              >
                Selesai
              </Button>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">Edit Profil Anggota</DialogTitle>
            <DialogDescription className="text-muted-foreground">Perbarui informasi biografi dan foto profil.</DialogDescription>
          </DialogHeader>
          
          {editingMember && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Peran</Label>
                  <Select
                    value={editingMember.role || "Anggota"}
                    onValueChange={(value) => setEditingMember({ ...editingMember, role: value })}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Pilih Peran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anggota">Anggota</SelectItem>
                      <SelectItem value="Ketua">Ketua</SelectItem>
                      <SelectItem value="Pengajar">Pengajar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tempat Lahir</Label>
                  <Input
                    value={editingMember.pob}
                    onChange={(e) => setEditingMember({ ...editingMember, pob: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Lahir</Label>
                  <Input
                    type="date"
                    value={editingMember.dob}
                    onChange={(e) => setEditingMember({ ...editingMember, dob: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telepon</Label>
                  <Input
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username Instagram</Label>
                  <Input
                    value={editingMember.ig}
                    onChange={(e) => setEditingMember({ ...editingMember, ig: e.target.value })}
                    placeholder="@username"
                    className="bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <Label>Foto Profil</Label>
                <div className="flex items-center gap-4">
                   <div className="relative group/editimg">
                      <img 
                        src={memberPreviewUrl || editingMember.image_url} 
                        alt="Profile Preview" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-accent/20" 
                      />
                    </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="edit-image-upload" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 border border-dashed border-white/20 p-4 rounded-md hover:bg-white/5 transition-colors">
                        <Upload className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium">
                          {selectedMemberFile ? selectedMemberFile.name : "Ganti Foto Profil"}
                        </span>
                      </div>
                    </Label>
                    <Input
                      id="edit-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'member')}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <p className="text-[10px] text-muted-foreground italic">Foto akan diunggah saat Anda menekan tombol Simpan di bawah.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <Label>Kutipan Pribadi ('Kata-kata')</Label>
                <QuoteGenerator onQuoteGenerated={(quote) => {
                  console.log("Setting auto-quote (edit):", quote);
                  setEditingMember({ ...editingMember, quote });
                }} />
                <Textarea
                  value={editingMember.quote}
                  onChange={(e) => setEditingMember({ ...editingMember, quote: e.target.value })}
                  className="bg-background/50 h-24 mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setEditingMember(null); }} className="border-white/10">
              Batal
            </Button>
            <Button onClick={handleSaveMember} disabled={isUploading} className="bg-accent text-background font-bold uppercase tracking-wider">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmModal.open} onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-white/10 rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">
              {confirmModal.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-lg">
              {confirmModal.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                confirmModal.onConfirm();
                setConfirmModal(prev => ({ ...prev, open: false }));
              }}
              className="rounded-xl bg-accent text-background font-bold uppercase tracking-widest px-8"
            >
              Ya, Simpan dan Unggah
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), {
  ssr: false
});
