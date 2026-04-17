"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Bell, UserPlus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminRequest } from "@/types";

interface RequestsTabProps {
  requests: AdminRequest[];
  onApprove: (request: AdminRequest) => void;
  onReject: (id: string) => void;
}

export function RequestsTab({ 
  requests, 
  onApprove, 
  onReject 
}: RequestsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Bell className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <CardTitle>Permintaan Persetujuan</CardTitle>
              <CardDescription>Antrian perubahan data dari Member yang perlu ditinjau.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Aksi</TableHead>
                <TableHead>Pemohon / Detail</TableHead>
                <TableHead className="w-[80px]">Data</TableHead>
                <TableHead className="w-[100px] text-right">Kontrol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <Badge variant={
                      req.action === 'DELETE' ? 'destructive' : 
                      req.action === 'CREATE' ? 'default' : 
                      req.action === 'ACCESS_REQUEST' ? 'outline' : 'secondary'
                    } className={req.action === 'ACCESS_REQUEST' ? 'bg-accent/10 text-accent border-accent/20' : ''}>
                      {req.action === 'ACCESS_REQUEST' ? (
                        <div className="flex items-center gap-1">
                          <UserPlus size={10} /> AKSES
                        </div>
                      ) : req.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold">{req.action === 'ACCESS_REQUEST' ? req.data.name : req.requested_by}</span>
                      <span className="text-[10px] opacity-60 italic">{req.action === 'ACCESS_REQUEST' ? req.data.email : req.table_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {req.action === 'ACCESS_REQUEST' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-accent/60 hover:text-accent">
                               <Info size={16} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background border-white/10 p-3 max-w-[200px] text-[10px]">
                            <p className="text-accent font-bold mb-1 uppercase tracking-widest">Detail Calon Admin:</p>
                            <p>Nama: {req.data.name}</p>
                            <p>Email: {req.data.email}</p>
                            <p className="mt-2 text-red-400">Password: {req.data.password}</p>
                            <p className="mt-2 italic text-white/40">Gunakan data ini untuk membuat akun di Supabase Auth.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                       <span className="text-[8px] opacity-40">Detail pada data...</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                        onClick={() => onApprove(req)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => onReject(req.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    Tidak ada permintaan tertunda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
