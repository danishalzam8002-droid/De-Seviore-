"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, Camera, Loader2, ExternalLink } from "lucide-react";
import { Album } from "@/types";

interface AlbumsTabProps {
  albums: Album[];
  onAdd: (album: Partial<Album>) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  uploadProgress: number;
  userRole?: string;
}

export function AlbumsTab({ 
  albums, 
  onAdd, 
  onDelete, 
  isUploading, 
  uploadProgress,
  userRole
}: AlbumsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState<Partial<Album>>({ title: "", drive_link: "", image_url: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleAdd = () => {
    const newErrors: Record<string, boolean> = {};
    if (!newAlbum.title?.trim()) newErrors.title = true;
    if (!newAlbum.drive_link?.trim()) newErrors.drive_link = true;
    if (!newAlbum.image_url?.trim()) newErrors.image_url = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onAdd(newAlbum);
    setNewAlbum({ title: "", drive_link: "", image_url: "" });
    setIsDialogOpen(false);
  };

  const isAdmin = userRole === 'Admin' || userRole === 'Admin Utama';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Daftar Album Kenangan</CardTitle>
            <CardDescription>Kelola koleksi foto Google Drive untuk dibagikan.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild className="border-accent/30 text-accent hover:bg-accent/10 font-bold">
              <a href="/albums" target="_blank">
                 PREVIEW HALAMAN <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            {isAdmin && (
              <Button onClick={() => setIsDialogOpen(true)} className="bg-accent text-background font-bold hover:bg-accent/80">
                <Plus className="w-4 h-4 mr-2" /> Tambah Album
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album, index) => (
              <div 
                key={album.id} 
                className="flex flex-col gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-accent/40 transition-all animate-in zoom-in-50 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img 
                    src={`${album.image_url}?q_auto,f_auto,w_400`} 
                    alt={album.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <h4 className="font-headline font-bold text-white tracking-wide line-clamp-1">{album.title}</h4>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent border-white/10 text-[10px] font-bold tracking-widest hover:bg-accent hover:text-background">
                    <a href={album.drive_link} target="_blank" rel="noreferrer">
                      BUKA DRIVE <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                  {isAdmin && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(album.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {albums.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl">
                <Camera className="w-12 h-12 mb-4 opacity-20" />
                <p className="italic">Belum ada album yang tersedia</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">Tambah Album Baru</DialogTitle>
            <DialogDescription className="text-muted-foreground">Bagikan tautan koleksi foto Anda dari Google Drive.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Judul Album</Label>
              <Input
                value={newAlbum.title}
                onChange={(e) => {
                  setNewAlbum({ ...newAlbum, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                placeholder="Misal: Perpisahan Sekolah 2024..."
                className={`bg-white/5 border-white/10 ${errors.title ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Tautan Google Drive</Label>
              <Input
                value={newAlbum.drive_link}
                onChange={(e) => {
                  setNewAlbum({ ...newAlbum, drive_link: e.target.value });
                  if (errors.drive_link) setErrors({ ...errors, drive_link: false });
                }}
                placeholder="https://drive.google.com/..."
                className={`bg-white/5 border-white/10 ${errors.drive_link ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Tautan Cover Image (Cloudinary dll)</Label>
              <Input
                value={newAlbum.image_url}
                onChange={(e) => {
                  setNewAlbum({ ...newAlbum, image_url: e.target.value });
                  if (errors.image_url) setErrors({ ...errors, image_url: false });
                }}
                placeholder="https://..."
                className={`bg-white/5 border-white/10 ${errors.image_url ? 'border-red-500' : ''}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button 
                onClick={handleAdd} 
                className="bg-accent text-background font-bold tracking-widest px-8"
            >
              SIMPAN ALBUM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
