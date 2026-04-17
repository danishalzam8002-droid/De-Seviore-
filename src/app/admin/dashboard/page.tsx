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
import { Activity, Bell, FileCheck, Check, X as XMark, LayoutDashboard } from "lucide-react";
import { Member, Kitab, Album, GalleryItem, AdminRole, AdminRequest } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// Import Refactored Tabs with Dynamic Loading
const MembersTab = dynamic(() => import("@/components/admin/tabs/MembersTab").then(mod => mod.MembersTab), { ssr: false });
const GalleryTab = dynamic(() => import("@/components/admin/tabs/GalleryTab").then(mod => mod.GalleryTab), { ssr: false });
const AlbumsTab = dynamic(() => import("@/components/admin/tabs/AlbumsTab").then(mod => mod.AlbumsTab), { ssr: false });
const LibraryTab = dynamic(() => import("@/components/admin/tabs/LibraryTab").then(mod => mod.LibraryTab), { ssr: false });
const AccessTab = dynamic(() => import("@/components/admin/tabs/AccessTab").then(mod => mod.AccessTab), { ssr: false });
const RequestsTab = dynamic(() => import("@/components/admin/tabs/RequestsTab").then(mod => mod.RequestsTab), { ssr: false });
const MonitoringTab = dynamic(() => import("@/components/admin/tabs/MonitoringTab").then(mod => mod.MonitoringTab), { ssr: false });



function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("members");
  const { user, loading: authLoading } = useUser();
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [albumItems, setAlbumItems] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

  const [kitabs, setKitabs] = useState<any[]>([]);
  const [adminRoles, setAdminRoles] = useState<any[]>([]);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const currentUserRole = adminRoles.find(a => a.email === user?.email)?.role || 'Member';

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    if (authLoading || !user) return; // Wait for auth session to be ready

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

        // Fetch Requests if Admin
        const { data: adminCheck } = await supabase.from('admins').select('role').eq('email', user?.email).single();
        if (adminCheck?.role === 'Admin' || adminCheck?.role === 'Admin Utama') {
          const { data: requestData } = await supabase.from('requests').select('*').eq('status', 'pending').order('created_at', { ascending: false });
          setRequests(requestData || []);
        }

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
  }, [user, authLoading]);

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

  const handleSaveMember = async (memberData: any) => {
    setConfirmModal({
      open: true,
      title: "Konfirmasi Simpan",
      description: `Apakah Anda yakin ingin menyimpan dan mengunggah data anggota "${memberData.name}" ke database?`,
      onConfirm: async () => {
        try {
          let imageUrl = memberData.image_url;
          const selectedMemberFile = memberData._file;

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
            name: memberData.name,
            pob: memberData.pob,
            dob: memberData.dob,
            phone: memberData.phone,
            ig: memberData.ig,
            quote: memberData.quote,
            role: memberData.role,
            image_url: imageUrl
          };

          if (currentUserRole === 'Member') {
            const { error } = await supabase.from('requests').insert([{
              table_name: 'members',
              action: memberData.id ? 'UPDATE' : 'CREATE',
              data: memberPayload,
              target_id: memberData.id || null,
              requested_by: user?.email
            }]);
            if (error) throw error;
            toast({ title: "Permintaan Dikirim", description: "Perubahan Anda sedang menunggu persetujuan Admin." });
          } else {
            if (memberData.id) {
              const { error } = await supabase
                .from('members')
                .update(memberPayload)
                .eq('id', memberData.id);
              
              if (error) throw error;
              
              setMembers(members.map(m => m.id === memberData.id ? { ...m, ...memberPayload } : m));
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
            }
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
          if (currentUserRole === 'Member') {
            const { error } = await supabase.from('requests').insert([{
              table_name: 'batch_info',
              action: 'UPDATE',
              data: batchContent,
              target_id: 1,
              requested_by: user?.email
            }]);
            if (error) throw error;
            toast({ title: "Permintaan Dikirim", description: "Pembaruan informasi angkatan menunggu persetujuan Admin." });
          } else {
            const { error } = await supabase
              .from('batch_info')
              .upsert({ id: 1, ...batchContent });
            
            if (error) throw error;
            toast({ title: "Berhasil", description: "Konten angkatan telah diperbarui." });
          }
        } catch(e) {
          console.error(e);
          toast({ title: "Error", description: "Gagal memperbarui konten angkatan.", variant: "destructive" });
        }
      }
    });
  };

  const startUpload = async (formData: FormData, type: 'gallery' | 'album' = 'gallery') => {
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

      if (type === 'gallery') {
        const newItem = { 
          image_url: downloadURL, 
          title: "Momen Seviore",
          created_at: new Date().toISOString()
        };
        const { data: insertedData, error } = await supabase.from('gallery').insert([newItem]).select().single();
        if (error) throw error;
        
        if (insertedData) {
          setGalleryItems([...galleryItems, insertedData]);
          toast({ title: "Berhasil", description: "Gambar ditambahkan ke galeri." });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Gagal", description: "Gagal mengunggah gambar ke Cloudinary.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddAlbum = async (albumPayload: any) => {

    setConfirmModal({
      open: true,
      title: "Konfirmasi Album",
      description: `Apakah Anda yakin ingin menambahkan album "${albumPayload.title}" ke koleksi?`,
      onConfirm: async () => {
        try {
          const formattedAlbum = {
            title: albumPayload.title,
            image_url: albumPayload.image_url,
            drive_link: albumPayload.drive_link,
            created_at: new Date().toISOString()
          };
          if (currentUserRole === 'Member') {
            const { error } = await supabase.from('requests').insert([{
              table_name: 'albums',
              action: 'CREATE',
              data: formattedAlbum,
              requested_by: user?.email
            }]);
            if (error) throw error;
            toast({ title: "Permintaan Dikirim", description: "Pengajuan album baru menunggu persetujuan Admin." });
          } else {
            const { data, error } = await supabase.from('albums').insert([formattedAlbum]).select().single();
            if (error) throw error;

            if (data) {
              setAlbumItems([...albumItems, data]);
              toast({ title: "Berhasil", description: "Album kenangan berhasil ditambahkan." });
            }
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

  const handleSaveKitab = async (kitabPayload: any) => {
    setConfirmModal({
      open: true,
      title: "Tambah Kitab",
      description: `Ingin mengunggah kitab "${kitabPayload.title}" ke perpustakaan digital?`,
      onConfirm: async () => {
        try {
          if (currentUserRole === 'Member') {
            const { error } = await supabase.from('requests').insert([{
              table_name: 'kitab',
              action: 'CREATE',
              data: kitabPayload,
              requested_by: user?.email
            }]);
            if (error) throw error;
            toast({ title: "Permintaan Dikirim", description: "Pengajuan kitab baru menunggu persetujuan Admin." });
          } else {
            const { data, error } = await supabase.from('kitab').insert([kitabPayload]).select().single();
            if (error) throw error;
            
            if (data) {
              setKitabs([...kitabs, data]);
            }
            toast({ title: "Ditambahkan", description: "Kitab baru berhasil diunggah." });
          }
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

  const handleCreateAdmin = async (adminData: any) => {

    setConfirmModal({
      open: true,
      title: "Tambah Akses Admin",
      description: `Apakah Anda yakin ingin memberikan hak akses admin kepada "${adminData.email}"?`,
      onConfirm: async () => {
        setIsCreatingAdmin(true);
        try {
          // 1. Create User in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: adminData.email,
            password: adminData.password,
          });

          if (authError) throw authError;

          // 2. Store Role in Supabase
          const { data: roleData, error: roleError } = await supabase
            .from('admins')
            .insert([{ email: adminData.email, role: adminData.role }])
            .select()
            .single();
          
          if (roleError) throw roleError;

          if (roleData) {
            setAdminRoles([...adminRoles, roleData]);
          }

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

  const handleApproveRequest = async (request: any) => {
    try {
      let error;
      if (request.action === 'CREATE') {
        ({ error } = await supabase.from(request.table_name).insert(request.data));
      } else if (request.action === 'UPDATE') {
        ({ error } = await supabase.from(request.table_name).update(request.data).eq('id', request.target_id));
      } else if (request.action === 'DELETE') {
        ({ error } = await supabase.from(request.table_name).delete().eq('id', request.target_id));
      }

      if (error) throw error;

      await supabase.from('requests').update({ status: 'approved' }).eq('id', request.id);
      setRequests(requests.filter(r => r.id !== request.id));
      toast({ title: "Permintaan Disetujui", description: "Perubahan telah diterapkan ke database." });
      
      const { data: updated } = await supabase.from(request.table_name).select('*');
      if (request.table_name === 'members') setMembers(updated || []);
      if (request.table_name === 'kitab') setKitabs(updated || []);
      if (request.table_name === 'albums') setAlbumItems(updated || []);
      
    } catch (err: any) {
      console.error(err);
      toast({ title: "Gagal Menyetujui", description: err.message, variant: "destructive" });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await supabase.from('requests').update({ status: 'rejected' }).eq('id', requestId);
      setRequests(requests.filter(r => r.id !== requestId));
      toast({ title: "Permintaan Ditolak", description: "Perubahan tidak diterapkan." });
    } catch (err: any) {
      toast({ title: "Gagal Menolak", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdateAdmin = async (id: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('admins')
        .update({ role: newRole })
        .eq('id', id);
      
      if (error) throw error;
      
      setAdminRoles(adminRoles.map(a => a.id === id ? { ...a, role: newRole } : a));
      toast({ title: "Role Diperbarui", description: "Hak akses admin telah diperbarui." });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Gagal Memperbarui", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Hapus akun akses ini?")) return;
    try {
      const { error } = await supabase.from('admins').delete().eq('id', adminId);
      if (error) throw error;
      setAdminRoles(adminRoles.filter(a => a.id !== adminId));
      toast({ title: "Akun Dihapus" });
    } catch (err: any) {
      toast({ title: "Gagal Menghapus", description: err.message, variant: "destructive" });
    }
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
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold accent-glow">
              {(currentUserRole === 'Admin' || currentUserRole === 'Admin Utama') ? "Dashboard Admin" : "Dashboard Member"}
            </h1>
            <p className="text-muted-foreground text-lg mt-2 font-light">
              {(currentUserRole === 'Admin' || currentUserRole === 'Admin Utama')
                ? "Kelola semua data dan setujui permintaan perubahan." 
                : "Kontribusi data dan upload momen ke galeri."}
            </p>
            {/* DEBUG INFO */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] text-accent font-mono">
              <span className="opacity-50">Debug:</span>
              <span>{user?.email || 'No Email'}</span>
              <span className="opacity-50">|</span>
              <span className="font-bold uppercase tracking-widest">{currentUserRole}</span>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
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
              <BookOpen className="w-4 h-4 mr-2" /> Pendidikan
            </TabsTrigger>
            {(currentUserRole === 'Admin' || currentUserRole === 'Admin Utama') && (
              <>
                <TabsTrigger value="access" className="data-[state=active]:bg-accent data-[state=active]:text-background">
                  <Key className="w-4 h-4 mr-2" /> {(currentUserRole === 'Admin' || currentUserRole === 'Admin Utama') ? "Akses Login" : "Profil Saya"}
                </TabsTrigger>
                <TabsTrigger value="requests" className="data-[state=active]:bg-accent data-[state=active]:text-background relative">
                  <Bell className="w-4 h-4 mr-2" /> Permintaan
                  {requests.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                      {requests.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="data-[state=active]:bg-accent data-[state=active]:text-background">
                  <Activity className="w-4 h-4 mr-2" /> Monitoring
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="members">
            <MembersTab 
              members={members} 
              onSave={handleSaveMember} 
              onDelete={handleDeleteMember}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </TabsContent>

          <TabsContent value="content">
             <Card className="glass-card max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
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

          <TabsContent value="gallery">
            <GalleryTab 
              galleryItems={galleryItems}
              onUpload={(file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
                formData.append("folder", "gallery");
                startUpload(formData, 'gallery');
              }}
              onDelete={handleDeleteGallery}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </TabsContent>

          <TabsContent value="albums">
            <AlbumsTab 
              albums={albumItems}
              onAdd={handleAddAlbum}
              onDelete={handleDeleteAlbum}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </TabsContent>

          <TabsContent value="library">
            <LibraryTab 
              kitabs={kitabs}
              onAdd={handleSaveKitab}
              onDelete={handleDeleteKitab}
            />
          </TabsContent>

          {(currentUserRole === 'Admin' || currentUserRole === 'Admin Utama') && (
            <>
              <TabsContent value="access">
                <AccessTab 
                  admins={adminRoles}
                  onAddAdmin={handleCreateAdmin}
                  onDeleteAdmin={handleDeleteAdmin}
                  onUpdateAdmin={handleUpdateAdmin}
                  currentUserEmail={user?.email}
                  isCreating={isCreatingAdmin}
                />
              </TabsContent>

              <TabsContent value="requests">
                <RequestsTab 
                  requests={requests}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                />
              </TabsContent>

              <TabsContent value="monitoring">
                <MonitoringTab />
              </TabsContent>
            </>
          )}
        </Tabs>
      </motion.div>
      </div>

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

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
