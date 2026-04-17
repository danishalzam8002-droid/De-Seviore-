"use client";

import dynamic from "next/dynamic";

const KakSeviBotBase = dynamic(() => import("@/components/KakSeviBot").then(mod => mod.KakSeviBot), {
  ssr: false,
});

export function KakSeviBotClient() {
  return <KakSeviBotBase />;
}
