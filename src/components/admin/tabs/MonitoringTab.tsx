"use client";

import { UsageMonitor } from "@/components/admin/UsageMonitor";

export function MonitoringTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <UsageMonitor />
    </div>
  );
}
