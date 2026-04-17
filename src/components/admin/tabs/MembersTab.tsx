"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Camera, X } from "lucide-react";
import { Member } from "@/types";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Member>({
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

  const handleSave = () => {
    const memberData = editingMember || newMember;
    
    if (!memberData.name) {
      setErrors({ name: true });
      return;
    }

    setErrors({});
    onSave({ ...memberData, _file: selectedFile } as any);
    // Reset local states after save
    if (!editingMember) {
      setNewMember({ name: "", pob: "", dob: "", phone: "", ig: "", quote: "", role: "Anggota", image_url: "" });
    }
    setEditingMember(null);
    setIsEditModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="glass-card md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>{editingMember ? "Ubah Anggota" : "Tambah Anggota"}</CardTitle>
            <CardDescription>Masukkan rincian biografi individu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form Fields - Similar to what was in the original file */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  value={editingMember ? editingMember.name : newMember.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    editingMember ? setEditingMember({ ...editingMember, name: val }) : setNewMember({ ...newMember, name: val });
                    if (errors.name) setErrors({});
                  }}
                  className={`bg-background/50 ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
              </div>
              <div className="space-y-2">
                <Label>Peran</Label>
                <Select
                  value={editingMember ? editingMember.role : newMember.role}
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
            {/* More fields... */}
            <Button 
                onClick={handleSave} 
                className="w-full bg-accent text-background hover:bg-accent/80"
            >
              {isUploading ? `Mengunggah ${uploadProgress}%` : (editingMember ? "Simpan Perubahan" : "Terbitkan Anggota")}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle>Direktori Angkatan</CardTitle>
            <CardDescription>Cari dan kelola data seluruh anggota.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Table or Grid of members */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.image_url || "https://placehold.co/100x100?text=No+Image"} 
                          alt={member.name} 
                          className="w-8 h-8 rounded-full object-cover border border-white/10" 
                        />
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingMember(member);
                          setIsEditModalOpen(true);
                        }}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete(member.id!)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="glass-card border-white/20 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profil Anggota</DialogTitle>
            <DialogDescription>Perbarui informasi profil {editingMember?.name}.</DialogDescription>
          </DialogHeader>
          {/* Edit form content... */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={isUploading}>
              {isUploading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
