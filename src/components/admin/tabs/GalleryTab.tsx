"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, ImageIcon, Loader2 } from "lucide-react";
import { optimizeCloudinary } from "@/lib/utils";
import { GalleryItem } from "@/types";

interface GalleryTabProps {
  galleryItems: GalleryItem[];
  onUpload: (file: File, title: string) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function GalleryTab({ 
  galleryItems, 
  onUpload, 
  onDelete, 
  isUploading, 
  uploadProgress 
}: GalleryTabProps) {
  const [galleryTitle, setGalleryTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (errors.file) setErrors({ ...errors, file: false });
    }
  };

  const handleUpload = () => {
    const newErrors: Record<string, boolean> = {};
    if (!galleryTitle?.trim()) newErrors.title = true;
    if (!selectedFile) newErrors.file = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onUpload(selectedFile!, galleryTitle);
    setGalleryTitle("");
    setSelectedFile(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="glass-card md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Unggah Momen</CardTitle>
            <CardDescription>Bagikan foto kegiatan ke galeri publik.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={galleryTitle}
                onChange={(e) => {
                  setGalleryTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                placeholder="Momen Seviore..."
                className={`bg-background/50 ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Input 
                type="file" 
                onChange={handleFileChange}
                accept="image/*"
                className={`bg-background/50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-background hover:file:bg-accent/80 ${errors.file ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.file && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <Button 
              onClick={handleUpload} 
              className="w-full bg-accent text-background hover:bg-accent/80 shadow-[0_0_15px_rgba(26,204,230,0.2)]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengunggah {uploadProgress}%
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Terbitkan ke Galeri
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle>Koleksi Galeri</CardTitle>
            <CardDescription>Kelola momen yang sudah diunggah.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square">
                  <img 
                    src={optimizeCloudinary(item.image_url, 400)} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                    <p className="text-xs font-medium mb-2">{item.title}</p>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onDelete(item.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {galleryItems.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl">
                  <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                  <p>Belum ada foto di galeri</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
