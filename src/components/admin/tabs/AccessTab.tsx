"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, UserPlus, Key, Loader2, ShieldCheck } from "lucide-react";
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
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="glass-card md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Tambah Akses Admin</CardTitle>
            <CardDescription>Berikan hak akses ke dashboard ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                value={newAdmin.email}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: false });
                }}
                placeholder="email@example.com"
                className={`bg-background/50 ${errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                value={newAdmin.password}
                onChange={(e) => {
                  setNewAdmin({ ...newAdmin, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: false });
                }}
                placeholder="******"
                className={`bg-background/50 ${errors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">wajib di isi</p>}
            </div>
            <div className="space-y-2">
              <Label>Level Akses</Label>
              <Select
                value={newAdmin.role}
                onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin Utama">Admin Utama</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
                onClick={handleCreate} 
                className="w-full bg-accent text-background hover:bg-accent/80"
            >
              {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Daftarkan Akses
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card md:col-span-2">
          <CardHeader>
            <CardTitle>Daftar Administrator</CardTitle>
            <CardDescription>Kelola akun yang memiliki akses dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {admin.email}
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
                        <SelectContent>
                          <SelectItem value="Admin Utama">Admin Utama</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        disabled={admin.email === currentUserEmail}
                        onClick={() => onDeleteAdmin(admin.id!)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
