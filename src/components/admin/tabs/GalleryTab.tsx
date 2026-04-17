"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Koleksi Galeri</CardTitle>
            <CardDescription>Kelola momen-momen berharga yang sudah diunggah.</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent text-background font-bold hover:bg-accent/80">
            <Plus className="w-4 h-4 mr-2" /> Unggah Momen
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryItems.map((item, index) => (
              <div 
                key={item.id} 
                className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square animate-in zoom-in-50 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img 
                  src={optimizeCloudinary(item.image_url, 400)} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-[10px] uppercase font-bold tracking-widest mb-2 line-clamp-2">{item.title}</p>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8 hover:scale-110 transition-transform"
                    onClick={() => onDelete(item.id!)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {galleryItems.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl">
                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="italic">Belum ada foto dalam koleksi</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">Unggah Momen Baru</DialogTitle>
            <DialogDescription className="text-muted-foreground">Pilih foto terbaik untuk dibagikan ke galeri publik.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Judul Momen</Label>
              <Input
                value={galleryTitle}
                onChange={(e) => {
                  setGalleryTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                placeholder="Misal: Reuni Akbar 2024..."
                className={`bg-white/5 border-white/10 ${errors.title ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Pilih Foto</Label>
              <Input 
                type="file" 
                onChange={handleFileChange}
                accept="image/*"
                className={`bg-white/5 border-white/10 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-accent file:text-background hover:file:bg-accent/80 ${errors.file ? 'border-red-500' : ''}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="bg-accent text-background font-bold tracking-widest px-8 shadow-[0_0_15px_rgba(26,204,230,0.2)]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  UNGGAH {uploadProgress}%
                </>
              ) : (
                "PUBLIKASIKAN"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
