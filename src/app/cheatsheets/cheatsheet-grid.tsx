"use client";

import { useState } from "react";
import CopyButton from "@/components/copy-button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheatsheetCategory {
  title: string;
  color: string;
  payloads: string[];
}

const colorMap: Record<string, { border: string; bg: string; badge: string; header: string }> = {
  red: {
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    badge: "bg-red-500/10 text-red-400",
    header: "from-red-500/10 to-red-500/5",
  },
  amber: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    badge: "bg-amber-500/10 text-amber-400",
    header: "from-amber-500/10 to-amber-500/5",
  },
  emerald: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    badge: "bg-emerald-500/10 text-emerald-400",
    header: "from-emerald-500/10 to-emerald-500/5",
  },
  violet: {
    border: "border-violet-500/20",
    bg: "bg-violet-500/5",
    badge: "bg-violet-500/10 text-violet-400",
    header: "from-violet-500/10 to-violet-500/5",
  },
  cyan: {
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
    badge: "bg-cyan-500/10 text-cyan-400",
    header: "from-cyan-500/10 to-cyan-500/5",
  },
  blue: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-400",
    header: "from-blue-500/10 to-blue-500/5",
  },
};

export default function CheatsheetGrid({
  data,
}: {
  data: CheatsheetCategory[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data
    .map((cat) => ({
      ...cat,
      payloads: searchQuery.trim()
        ? cat.payloads.filter((p) =>
            p.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : cat.payloads,
    }))
    .filter((cat) => cat.payloads.length > 0);

  return (
    <>
      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search payloads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((cat) => {
          const colors = colorMap[cat.color] || colorMap.violet;
          return (
            <div
              key={cat.title}
              className={cn(
                "rounded-xl border bg-slate-900/30 overflow-hidden",
                colors.border
              )}
            >
              {/* Card Header */}
              <div
                className={cn(
                  "px-5 py-4 bg-gradient-to-r border-b",
                  colors.header,
                  colors.border
                )}
              >
                <h3 className="text-base font-semibold text-slate-200">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {cat.payloads.length}{" "}
                  {cat.payloads.length === 1 ? "payload" : "payloads"}
                </p>
              </div>

              {/* Payloads List */}
              <div className="divide-y divide-slate-800/50">
                {cat.payloads.map((payload, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-800/30 transition-colors group"
                  >
                    <code className="text-sm text-slate-300 font-mono truncate flex-1">
                      {payload}
                    </code>
                    <CopyButton
                      text={payload}
                      className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-20 rounded-xl border border-dashed border-slate-800">
          <p className="text-slate-500 text-sm">
            No payloads match your search.
          </p>
        </div>
      )}
    </>
  );
}
