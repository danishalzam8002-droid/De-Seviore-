"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Info, Users, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

import { useRouter } from "next/navigation";

export default function DebugPage() {
  const router = useRouter();
  const [envStatus, setEnvStatus] = useState<Record<string, { set: boolean; value?: string }>>({});
  const [authState, setAuthState] = useState<{ user: any; session: any; loading: boolean }>({ user: null, session: null, loading: true });

  useEffect(() => {
    // Check Auth and Role
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }

      // Check if user is in 'admins' table
      const { data: adminData } = await supabase
        .from('admins')
        .select('role')
        .eq('email', session.user.email)
        .single();

      if (!adminData) {
        router.push("/");
        return;
      }

      setAuthState({
        user: session.user,
        session: session,
        loading: false,
      });
    };
    checkAccess();
    const checkEnv = () => {
      const status: Record<string, { set: boolean; value?: string }> = {
        "NEXT_PUBLIC_SUPABASE_URL": { 
          set: !!process.env.NEXT_PUBLIC_SUPABASE_URL, 
          value: process.env.NEXT_PUBLIC_SUPABASE_URL ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 5)}...` : undefined 
        },
        "NEXT_PUBLIC_SUPABASE_ANON_KEY": { 
          set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
          value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` : undefined 
        },
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME": { 
          set: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
          value: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? `${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.substring(0, 5)}...` : undefined 
        },
        "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET": { 
          set: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, 
          value: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.substring(0, 5)}...` : undefined 
        },
        "NEXT_PUBLIC_FIREBASE_API_KEY": { 
          set: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
          value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? `${process.env.NEXT_PUBLIC_FIREBASE_API_KEY.substring(0, 5)}...` : undefined 
        },
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID": { 
          set: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 
          value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.substring(0, 5)}...` : undefined 
        },
      };
      setEnvStatus(status);
    };
    checkEnv();

    // Check Auth
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthState({
        user: session?.user || null,
        session: session || null,
        loading: false,
      });
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user || null,
        session: session || null,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
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
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Auth Diagnostics
              </h3>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Session</span>
                  {authState.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : authState.session ? (
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="opacity-50">None</Badge>
                  )}
                </div>
                {authState.user && (
                    <div className="pt-2 mt-2 border-t border-white/5 space-y-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Logged in as:</p>
                        <p className="text-sm font-mono text-accent">{authState.user.email}</p>
                        <p className="text-[10px] text-muted-foreground">ID: {authState.user.id}</p>
                        {!authState.user.email_confirmed_at && (
                            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-500 flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                Email belum dikonfirmasi!
                            </div>
                        )}
                    </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-xs text-accent">
                <strong>Tip:</strong> If any variable shows a red X, add it to your Vercel Dashboard and redeploy. 
                Common issue: Users added via UI need email confirmation unless disabled in Supabase settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
