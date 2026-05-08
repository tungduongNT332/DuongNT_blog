import Link from "next/link";
import { ArrowRight, Calendar, Bug, Wrench, Flag, FileCode } from "lucide-react";
import type { PostMeta } from "@/lib/content";
import CategoryBadge from "./category-badge";
import { formatDate } from "@/lib/utils";

const categoryIcons: Record<string, React.ReactNode> = {
  vulnerability: <Bug className="h-8 w-8" />,
  tool: <Wrench className="h-8 w-8" />,
  writeup: <Flag className="h-8 w-8" />,
  cheatsheet: <FileCode className="h-8 w-8" />,
};

const categoryGradients: Record<string, string> = {
  vulnerability: "from-red-500/20 to-orange-500/20",
  tool: "from-cyan-500/20 to-blue-500/20",
  writeup: "from-amber-500/20 to-yellow-500/20",
  cheatsheet: "from-emerald-500/20 to-teal-500/20",
};

const categoryIconColors: Record<string, string> = {
  vulnerability: "text-red-400",
  tool: "text-cyan-400",
  writeup: "text-amber-400",
  cheatsheet: "text-emerald-400",
};

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="relative h-full rounded-xl border border-slate-800/60 bg-slate-900/50 p-5 transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-800/40 hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-0.5">
        {/* Thumbnail Icon Area */}
        <div
          className={`mb-4 flex h-20 items-center justify-center rounded-lg bg-gradient-to-br ${
            categoryGradients[post.category] || categoryGradients.vulnerability
          }`}
        >
          <span className={categoryIconColors[post.category] || "text-slate-400"}>
            {categoryIcons[post.category] || categoryIcons.vulnerability}
          </span>
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <CategoryBadge category={post.category} />
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-slate-100 line-clamp-2 group-hover:text-violet-300 transition-colors duration-200">
          {post.title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-slate-400 line-clamp-2 leading-relaxed">
          {post.description}
        </p>

        {/* Footer: Date + Read More */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.date)}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent group-hover:gap-2 transition-all duration-200">
            Read more
            <ArrowRight className="h-3 w-3 text-violet-400" />
          </span>
        </div>
      </article>
    </Link>
  );
}
