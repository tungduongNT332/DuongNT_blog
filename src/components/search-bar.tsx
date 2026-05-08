"use client";

import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SearchBar({
  onSearch,
  onSort,
}: {
  onSearch: (query: string) => void;
  onSort: (sort: "newest" | "oldest") => void;
}) {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search posts..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
      </div>
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => {
            const val = e.target.value as "newest" | "oldest";
            setSort(val);
            onSort(val);
          }}
          className="appearance-none rounded-lg border border-slate-800 bg-slate-900/80 py-2.5 pl-4 pr-10 text-sm text-slate-300 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}
