"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function DebugPage() {
  const [envStatus, setEnvStatus] = useState<Record<string, { set: boolean; value?: string }>>({});

  useEffect(() => {
    const keys = [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
      "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    ];

    const status: Record<string, { set: boolean; value?: string }> = {};
    keys.forEach((key) => {
      const val = process.env[key] || (typeof window !== 'undefined' ? (window as any)._env_?.[key] : undefined); // Basic check
      // Note: process.env.NEXT_PUBLIC_... is replaced at build time in Next.js
      // We can only check them if they were available during build for client-side
      status[key] = {
        set: !!process.env[key],
        value: process.env[key] ? `${process.env[key]?.substring(0, 5)}...` : undefined,
      };
    });
    setEnvStatus(status);
  }, []);

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      <div className="container mx-auto px-6 pt-32">
        <Card className="glass-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Info className="w-6 h-6 text-accent" />
              Environment Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Use this page to verify if your Vercel environment variables are correctly set. 
              Values are masked for security.
            </p>
            <div className="space-y-2">
              {Object.entries(envStatus).map(([key, info]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-sm font-mono">{key}</span>
                  <div className="flex items-center gap-2">
                    {info.set ? (
                      <>
                        <span className="text-xs text-muted-foreground font-mono">{info.value}</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </>
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs text-accent">
                <strong>Tip:</strong> If any variable shows a red X, add it to your Vercel Dashboard and redeploy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
