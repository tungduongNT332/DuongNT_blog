"use client";

import { useState, useMemo } from "react";
import PostCard from "@/components/post-card";
import SearchBar from "@/components/search-bar";
import type { PostMeta } from "@/lib/content";
import { cn } from "@/lib/utils";

const categories = [
  { key: "all", label: "All" },
  { key: "vulnerability", label: "Vulnerabilities" },
  { key: "tool", label: "Tools" },
  { key: "writeup", label: "Writeups" },
  { key: "cheatsheet", label: "Cheatsheets" },
];

export default function PostsListClient({
  initialPosts,
  initialCategory,
}: {
  initialPosts: PostMeta[];
  initialCategory?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [activeCategory, setActiveCategory] = useState(initialCategory || "all");

  const filteredPosts = useMemo(() => {
    let posts = [...initialPosts];

    if (activeCategory !== "all") {
      posts = posts.filter((p) => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    posts.sort((a, b) => {
      const tA = new Date(a.date).getTime();
      const tB = new Date(b.date).getTime();
      return sortOrder === "newest" ? tB - tA : tA - tB;
    });

    return posts;
  }, [initialPosts, activeCategory, searchQuery, sortOrder]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">All Posts</h1>
        <p className="text-slate-500">
          Browse articles on web vulnerabilities, pentest tools, CTF writeups, and more.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === cat.key
                ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <SearchBar onSearch={setSearchQuery} onSort={setSortOrder} />
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-dashed border-slate-800">
          <p className="text-slate-500 text-sm">
            No posts found matching your criteria.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-600">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
}
