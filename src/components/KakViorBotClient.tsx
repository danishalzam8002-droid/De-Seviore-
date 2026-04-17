"use client";

import dynamic from "next/dynamic";

const KakViorBotBase = dynamic(() => import("@/components/KakViorBot").then(mod => mod.KakViorBot), {
  ssr: false,
});

export function KakViorBotClient() {
  return <KakViorBotBase />;
}
