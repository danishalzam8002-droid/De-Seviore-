"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Camera, X, Loader2, Instagram, MessageSquare, MapPin, Calendar, Quote as QuoteIcon } from "lucide-react";
import { Member } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface MembersTabProps {
  members: Member[];
  onSave: (member: Partial<Member>) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  uploadProgress: number;
}

export function MembersTab({ 
  members, 
  onSave, 
  onDelete, 
  isUploading, 
  uploadProgress 
}: MembersTabProps) {
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Member>({
    name: "", pob: "", dob: "", phone: "", ig: "", quote: "", role: "Anggota", image_url: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({ name: "", pob: "", dob: "", phone: "", ig: "", quote: "", role: "Anggota", image_url: "" });
    setPreviewUrl("");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setFormData(member);
    setPreviewUrl(member.image_url || "");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      setErrors({ name: true });
      return;
    }

    setErrors({});
    onSave({ ...formData, _file: selectedFile } as any);
    
    // Close modal and reset
    setIsModalOpen(false);
    setEditingMember(null);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Direktori Angkatan</CardTitle>
            <CardDescription>Cari dan kelola data seluruh anggota De Seviore.</CardDescription>
          </div>
          <Button onClick={handleOpenAdd} className="bg-accent text-background font-bold hover:bg-accent/80">
            <Plus className="w-4 h-4 mr-2" /> Tambah Anggota
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="text-accent font-bold">Anggota</TableHead>
                  <TableHead className="text-accent font-bold">Peran</TableHead>
                  <TableHead className="text-accent font-bold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-accent/20">
                          <img 
                            src={member.image_url || "https://placehold.co/100x100?text=No+Image"} 
                            alt={member.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold">{member.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{member.phone || "No HP"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-accent/20 hover:text-accent" onClick={() => handleOpenEdit(member)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-destructive/20 hover:text-destructive" onClick={() => onDelete(member.id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {members.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-40 text-center text-muted-foreground">
                      Belum ada anggota yang terdaftar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">
              {editingMember ? "Ubah Profil" : "Tambah Anggota Baru"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground italic">
              Lengkapi data biografi anggota De Seviore.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Foto Profil */}
            <div className="md:col-span-2 flex flex-col items-center gap-4 py-4 border-b border-white/5 mb-2">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-accent/20 group cursor-pointer">
                <img 
                  src={previewUrl || "https://placehold.co/200x200?text=Pilih+Foto"} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] font-bold text-white uppercase">Upload</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Format JPG/PNG, Maks. 2MB</p>
            </div>

            {/* Nama & Role */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-accent/70 uppercase flex items-center gap-1">
                Nama Lengkap
              </Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Ahmad Seviore"
                className={`bg-white/5 border-white/10 ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-accent/70 uppercase">Peran</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => setFormData({ ...formData, role: val })}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Pilih Peran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anggota">Anggota</SelectItem>
                  <SelectItem value="Ketua">Ketua</SelectItem>
                  <SelectItem value="Sekertaris">Sekertaris</SelectItem>
                  <SelectItem value="Bendahara">Bendahara</SelectItem>
                  <SelectItem value="Penguat">Penguat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* POB & DOB */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-accent/70 uppercase">Tempat Lahir</Label>
              <Input 
                value={formData.pob}
                onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                placeholder="Purwakarta"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-accent/70 uppercase">Tanggal Lahir</Label>
              <Input 
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                placeholder="01 Januari 2005"
                className="bg-white/5 border-white/10"
              />
            </div>

            {/* Kontak & Media Sosial */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-accent/70 uppercase">No. WhatsApp</Label>
              <Input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812xxxx"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-accent/70 uppercase">Username IG</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input 
                  value={formData.ig}
                  onChange={(e) => setFormData({ ...formData, ig: e.target.value })}
                  placeholder="username"
                  className="bg-white/5 border-white/10 pl-8"
                />
              </div>
            </div>

            {/* Quote */}
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[10px] font-bold text-accent/70 uppercase">Kutipan (Quote)</Label>
              <Textarea 
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                placeholder="Tulis pesan atau filosofi hidup..."
                className="bg-white/5 border-white/10 h-24"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button 
              onClick={handleSave} 
              disabled={isUploading}
              className="bg-accent text-background font-bold tracking-widest px-8"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {uploadProgress}%
                </>
              ) : (
                editingMember ? "UPDATE DATA" : "TERBITKAN" 
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
