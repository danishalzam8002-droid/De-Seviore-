"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Plus, BookOpen, ExternalLink, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Kitab } from "@/types";

interface LibraryTabProps {
  kitabs: Kitab[];
  onAdd: (kitab: Partial<Kitab>) => void;
  onDelete: (id: string) => void;
}

export function LibraryTab({ 
  kitabs, 
  onAdd, 
  onDelete 
}: LibraryTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKitab, setNewKitab] = useState<Partial<Kitab>>({ title: "", author: "", category: "", file_url: "" });
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleAdd = () => {
    const newErrors: Record<string, boolean> = {};
    if (!newKitab.title?.trim()) newErrors.title = true;
    if (!newKitab.file_url?.trim()) newErrors.file_url = true;
    
    const categoryToVerify = isCustomCategory ? customCategory : newKitab.category;
    if (!categoryToVerify?.trim()) newErrors.category = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const finalCategory = isCustomCategory ? customCategory : (newKitab.category || "Umum");
    onAdd({ ...newKitab, category: finalCategory });
    setNewKitab({ title: "", author: "", category: "", file_url: "" });
    setIsCustomCategory(false);
    setCustomCategory("");
    setIsDialogOpen(false);
  };

  const filteredKitabs = kitabs.filter(kitab => 
    kitab.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kitab.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kitab.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Koleksi Digital</CardTitle>
              <CardDescription>Kelola pustaka kitab online De Seviore.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul kitab..."
                  className="pl-9 bg-background/30 border-white/10"
                />
              </div>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-accent text-background font-bold hover:bg-accent/80">
                <Plus className="w-4 h-4 mr-2" /> Tambah Kitab
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="text-accent font-bold">Kitab</TableHead>
                  <TableHead className="text-accent font-bold">Kategori</TableHead>
                  <TableHead className="text-accent font-bold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredKitabs.map((kitab, index) => (
                    <motion.tr 
                      key={kitab.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-bold text-white transition-colors">{kitab.title}</p>
                            <p className="text-[10px] text-muted-foreground italic uppercase tracking-widest">{kitab.author || "Tanpa Pengarang"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:border-accent/30 group-hover:text-accent transition-all">
                          {kitab.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild className="hover:bg-accent/20 hover:text-accent">
                            <a href={kitab.file_url} target="_blank" rel="noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onDelete(kitab.id!)}
                            className="hover:bg-destructive/20 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredKitabs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">
                       Tidak ada hasil pencarian atau data kosong.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">Tambah Koleksi Kitab</DialogTitle>
            <DialogDescription className="text-muted-foreground">Bagikan referensi digital ke perpustakaan online.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Judul Kitab</Label>
              <Input
                value={newKitab.title}
                onChange={(e) => {
                  setNewKitab({ ...newKitab, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                placeholder="Safinatun Najah..."
                className={`bg-white/5 border-white/10 ${errors.title ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Nama Pengarang / Ulama</Label>
              <Input
                value={newKitab.author}
                onChange={(e) => setNewKitab({ ...newKitab, author: e.target.value })}
                placeholder="Syeikh Sumair..."
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-accent/70">Kategori Pendidikan</Label>
                <Select
                  value={isCustomCategory ? "custom" : newKitab.category}
                  onValueChange={(value) => {
                    setErrors({ ...errors, category: false });
                    if (value === "custom") {
                      setIsCustomCategory(true);
                      setNewKitab({ ...newKitab, category: "" });
                    } else {
                      setIsCustomCategory(false);
                      setNewKitab({ ...newKitab, category: value });
                    }
                  }}
                >
                  <SelectTrigger className={`bg-white/5 border-white/10 ${errors.category ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fiqih">Fiqih</SelectItem>
                    <SelectItem value="Aqidah">Aqidah</SelectItem>
                    <SelectItem value="Hadits">Hadits</SelectItem>
                    <SelectItem value="Tafsir">Tafsir</SelectItem>
                    <SelectItem value="Akhlak">Akhlak</SelectItem>
                    <SelectItem value="Umum">Umum</SelectItem>
                    <SelectItem value="custom" className="text-accent font-bold italic">+ Tambah Kategori Lainnya...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isCustomCategory && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="text-[10px] uppercase font-bold text-accent/70">Nama Kategori Baru</Label>
                  <Input
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      if (errors.category) setErrors({ ...errors, category: false });
                    }}
                    placeholder="Masukkan nama kategori baru..."
                    className="bg-accent/5 border-accent/20"
                    autoFocus
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Tautan File (Drive/Direct Link)</Label>
              <Input
                value={newKitab.file_url}
                onChange={(e) => {
                  setNewKitab({ ...newKitab, file_url: e.target.value });
                  if (errors.file_url) setErrors({ ...errors, file_url: false });
                }}
                placeholder="https://..."
                className={`bg-white/5 border-white/10 ${errors.file_url ? 'border-red-500' : ''}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleAdd} className="bg-accent text-background font-bold tracking-widest px-8">
              SIMPAN KITAB
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
