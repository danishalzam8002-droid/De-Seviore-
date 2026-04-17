"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, BookOpen, ExternalLink, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Kitab } from "@/types";

interface LibraryTabProps {
  kitabs: Kitab[];
  onAdd: (kitab: Partial<Kitab>) => void;
  onDelete: (id: string) => void;
}

// UI Enhancement: Added premium hover and transition effects for better user interaction
export function LibraryTab({ 
  kitabs, 
  onAdd, 
  onDelete 
}: LibraryTabProps) {
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
  };

  const filteredKitabs = kitabs.filter(kitab => 
    kitab.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kitab.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kitab.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="glass-card md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Tambah Koleksi Kitab</CardTitle>
            <CardDescription>Bagikan referensi digital ke perpustakaan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Kitab</Label>
              <Input
                value={newKitab.title}
                onChange={(e) => {
                  setNewKitab({ ...newKitab, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: false });
                }}
                placeholder="Safinatun Najah..."
                className={`bg-background/50 ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.title && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Label>Nama Pengarang / Ulama</Label>
              <Input
                value={newKitab.author}
                onChange={(e) => setNewKitab({ ...newKitab, author: e.target.value })}
                placeholder="Syeikh Sumair..."
                className="bg-background/50"
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kategori Pendidikan</Label>
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
                  <SelectTrigger className={`bg-background/50 ${errors.category ? 'border-red-500 ring-1 ring-red-500' : ''}`}>
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
                {errors.category && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
              </div>

              {isCustomCategory && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label>Nama Kategori Baru</Label>
                  <Input
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      if (errors.category) setErrors({ ...errors, category: false });
                    }}
                    placeholder="Masukkan nama kategori baru..."
                    className={`bg-accent/5 border-accent/20 ${errors.category ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                    autoFocus
                  />
                  {errors.category && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tautan File</Label>
              <Input
                value={newKitab.file_url}
                onChange={(e) => {
                  setNewKitab({ ...newKitab, file_url: e.target.value });
                  if (errors.file_url) setErrors({ ...errors, file_url: false });
                }}
                placeholder="https://..."
                className={`bg-background/50 ${errors.file_url ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.file_url && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <Button 
                onClick={handleAdd} 
                className="w-full bg-accent text-background hover:bg-accent/80"
            >
              <Plus className="w-4 h-4 mr-2" />
              Simpan Kitab
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Daftar Koleksi Digital</CardTitle>
                <CardDescription>Kelola pustaka kitab online.</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul kitab..."
                  className="pl-9 bg-background/30 border-white/10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kitab</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Aksi</TableHead>
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
                      whileHover={{ 
                        scale: 1.015, 
                        backgroundColor: "rgba(26, 204, 230, 0.08)",
                        boxShadow: "0 0 25px rgba(26, 204, 230, 0.15)",
                        borderColor: "rgba(26, 204, 230, 0.4)"
                      }}
                      className="group border-b border-white/5 transition-all duration-300 cursor-default relative overflow-hidden"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                            <BookOpen className="w-4 h-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-accent transition-colors">{kitab.title}</p>
                            <p className="text-xs text-muted-foreground italic">{kitab.author || "Tanpa Pengarang"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:border-accent/30 group-hover:text-accent transition-all">
                          {kitab.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
