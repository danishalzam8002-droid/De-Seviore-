"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Camera, Loader2, ExternalLink } from "lucide-react";
import { Album } from "@/types";

interface AlbumsTabProps {
  albums: Album[];
  onAdd: (album: Partial<Album>) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function AlbumsTab({ 
  albums, 
  onAdd, 
  onDelete, 
  isUploading, 
  uploadProgress 
}: AlbumsTabProps) {
  const [newAlbum, setNewAlbum] = useState<Partial<Album>>({ title: "", drive_link: "", image_url: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleAdd = () => {
    const newErrors: Record<string, boolean> = {};
    if (!newAlbum.title) newErrors.title = true;
    if (!newAlbum.drive_link) newErrors.drive_link = true;
    if (!newAlbum.image_url) newErrors.image_url = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onAdd(newAlbum);
    setNewAlbum({ title: "", drive_link: "", image_url: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="glass-card h-fit">
          <CardHeader>
            <CardTitle>Tambah Album Kenangan</CardTitle>
            <CardDescription>Buat koleksi foto drive untuk dibagikan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={newAlbum.title}
                onChange={(e) => {
                  setNewAlbum({ ...newAlbum, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                placeholder="Album Perpisahan..."
                className={`bg-background/50 ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Input
                value={newAlbum.drive_link}
                onChange={(e) => {
                  setNewAlbum({ ...newAlbum, drive_link: e.target.value });
                  if (errors.drive_link) setErrors({ ...errors, drive_link: false });
                }}
                placeholder="https://drive.google.com/..."
                className={`bg-background/50 ${errors.drive_link ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.drive_link && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Input
                value={newAlbum.image_url}
                onChange={(e) => {
                  setNewAlbum({ ...newAlbum, image_url: e.target.value });
                  if (errors.image_url) setErrors({ ...errors, image_url: false });
                }}
                placeholder="https://..."
                className={`bg-background/50 ${errors.image_url ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.image_url && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <Button 
                onClick={handleAdd} 
                className="w-full bg-accent text-background hover:bg-accent/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Simpan Album
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Daftar Album</CardTitle>
            <CardDescription>Kelola album yang sudah ada.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {albums.map((album) => (
                <div key={album.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 group hover:border-accent/40 transition-all">
                  <img 
                    src={`${album.image_url}?q_auto,f_auto,w_100`} 
                    alt={album.title} 
                    className="w-16 h-16 rounded-lg object-cover" 
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{album.title}</h4>
                    <a href={album.drive_link} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground flex items-center hover:text-accent">
                      Buka Drive <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(album.id!)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {albums.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl">
                  <Camera className="w-12 h-12 mb-4 opacity-20" />
                  <p>Belum ada album</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
