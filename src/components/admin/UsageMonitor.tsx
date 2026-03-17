"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, Zap, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface UsageData {
  supabase: {
    tables: {
      members: number;
      kitab: number;
      news: number;
    };
    limits: {
      rows: number;
      diskMB: number;
    }
  };
  cloudinary: {
    estimatedItems: number;
    limitCredits: number;
  };
  vercel: {
    bandwidthLimitGB: number;
    buildMinutesLimit: number;
  }
}

export function UsageMonitor() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsage = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/usage');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch usage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-accent/10 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const totalRows = Object.values(data.supabase.tables).reduce((a, b) => a + b, 0);
  const dbProgress = (totalRows / data.supabase.limits.rows) * 100;
  
  // Cloudinary estimate: each item in DB roughly represents 1-2 credits with transformations
  const cloudinaryProgress = (data.cloudinary.estimatedItems / (data.cloudinary.limitCredits * 100)) * 100;

  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          System Resource Monitoring
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchUsage} 
          disabled={loading}
          className="glass-button"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Supabase Card */}
        <Card className="glass-card hover:border-accent/40 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Database className="w-5 h-5 text-emerald-500" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-emerald-500/30 text-emerald-400">
                Supabase
              </Badge>
            </div>
            <CardTitle className="mt-4">Database Usage</CardTitle>
            <CardDescription>Free Tier (500MB Limit)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Row Count ({totalRows} items)</span>
                <span>{Math.round(dbProgress)}%</span>
              </div>
              <Progress value={dbProgress} className="h-1.5 bg-accent/20" />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-bold text-white">{data.supabase.tables.members}</div>
                <div className="text-[10px] text-muted-foreground">Members</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-bold text-white">{data.supabase.tables.kitab}</div>
                <div className="text-[10px] text-muted-foreground">Kitab</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm font-bold text-white">{data.supabase.tables.news}</div>
                <div className="text-[10px] text-muted-foreground">Berita</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cloudinary Card */}
        <Card className="glass-card hover:border-accent/40 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-500" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-blue-500/30 text-blue-400">
                Cloudinary
              </Badge>
            </div>
            <CardTitle className="mt-4">Image Storage</CardTitle>
            <CardDescription>25 Monthly Credits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Estimated Usage</span>
                <span>{Math.round(cloudinaryProgress)}%</span>
              </div>
              <Progress value={cloudinaryProgress} className="h-1.5 bg-accent/20" />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Berdasarkan jumlah media yang terdaftar di database. Cek dashboard Cloudinary untuk data transformasi yang lebih akurat.
            </p>
            <Button variant="ghost" size="sm" className="w-full text-[10px] text-blue-400 hover:text-blue-300" asChild>
              <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer">
                Go to Cloudinary <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Vercel Card */}
        <Card className="glass-card hover:border-accent/40 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-white/10 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-white/30 text-white">
                Vercel
              </Badge>
            </div>
            <CardTitle className="mt-4">Deployment</CardTitle>
            <CardDescription>Hobby Plan Limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase">Bandwidth</div>
                <div className="text-sm font-semibold">{data.vercel.bandwidthLimitGB}GB</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-muted-foreground uppercase">Build Min</div>
                <div className="text-sm font-semibold">6,000</div>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-1">
              <div className="text-[10px] font-medium text-amber-400 flex items-center">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                Peringatan Free Tier
              </div>
              <p className="text-[10px] text-muted-foreground">
                Vercel akan menjeda proyek jika bandwidth melebihi 100GB/bulan.
              </p>
            </div>
            <Button variant="ghost" size="sm" className="w-full text-[10px] text-white hover:bg-white/10" asChild>
              <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">
                Go to Vercel <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
