"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Bell } from "lucide-react";
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
                <TableHead>Tabel</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium uppercase text-[10px] tracking-wider">{req.table_name}</TableCell>
                  <TableCell>
                    <Badge variant={req.action === 'DELETE' ? 'destructive' : req.action === 'CREATE' ? 'default' : 'secondary'}>
                      {req.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{req.requested_by}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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
