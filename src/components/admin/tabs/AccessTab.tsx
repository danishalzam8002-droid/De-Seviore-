"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, UserPlus, Key, Loader2, ShieldCheck, Plus } from "lucide-react";
import { AdminRole } from "@/types";

interface AccessTabProps {
  admins: AdminRole[];
  onAddAdmin: (admin: any) => void;
  onDeleteAdmin: (id: string) => void;
  onUpdateAdmin: (id: string, newRole: string) => void;
  currentUserEmail: string | undefined;
  isCreating: boolean;
}

export function AccessTab({ 
  admins, 
  onAddAdmin, 
  onDeleteAdmin, 
  onUpdateAdmin,
  currentUserEmail,
  isCreating 
}: AccessTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", role: "Member" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleCreate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!newAdmin.email?.trim()) newErrors.email = true;
    if (!newAdmin.password?.trim()) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (newAdmin.email && newAdmin.password) {
      onAddAdmin(newAdmin);
      setNewAdmin({ email: "", password: "", role: "Member" });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Daftar Administrator</CardTitle>
            <CardDescription>Kelola akun yang memiliki akses dashboard De Seviore.</CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent text-background font-bold hover:bg-accent/80">
            <Plus className="w-4 h-4 mr-2" /> Tambah Akses
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="text-accent font-bold">Email</TableHead>
                  <TableHead className="text-accent font-bold">Status Akun</TableHead>
                  <TableHead className="text-accent font-bold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white">{admin.email}</span>
                        {admin.email === currentUserEmail && (
                          <ShieldCheck className="w-3 h-3 text-accent" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={admin.role}
                        onValueChange={(value) => onUpdateAdmin(admin.id!, value)}
                        disabled={admin.email === currentUserEmail}
                      >
                        <SelectTrigger className="h-7 w-[130px] text-[10px] bg-accent/10 border-accent/20 text-accent font-bold uppercase tracking-wider">
                          <SelectValue placeholder={admin.role} />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-white/10">
                          <SelectItem value="Admin Utama">Admin Utama</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="hover:bg-destructive/10 text-destructive"
                        disabled={admin.email === currentUserEmail}
                        onClick={() => onDeleteAdmin(admin.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-accent uppercase tracking-wider">Tambah Akses Admin</DialogTitle>
            <DialogDescription className="text-muted-foreground">Berikan hak akses manajemen kepada pengurus baru.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Email Pengguna</Label>
              <Input
                type="email"
                value={newAdmin.email}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: false });
                }}
                placeholder="email@example.com"
                className={`bg-white/5 border-white/10 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Password Sementara</Label>
              <Input
                type="password"
                value={newAdmin.password}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: false });
                }}
                placeholder="******"
                className={`bg-white/5 border-white/10 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-accent/70">Status Akun</Label>
              <Select
                value={newAdmin.role}
                onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin Utama">Admin Utama</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button 
                onClick={handleCreate} 
                disabled={isCreating}
                className="bg-accent text-background font-bold tracking-widest px-8"
            >
              {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
              DAFTARKAN AKSES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
