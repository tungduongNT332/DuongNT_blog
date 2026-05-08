import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { label: string; color: string }> = {
  vulnerability: {
    label: "Vulnerability",
    color: "bg-red-500/10 text-red-400 ring-red-500/20",
  },
  tool: {
    label: "Tool",
    color: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
  },
  writeup: {
    label: "Writeup",
    color: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
  },
  cheatsheet: {
    label: "Cheatsheet",
    color: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  },
  project: {
    label: "Project",
    color: "bg-indigo-500/10 text-indigo-400 ring-indigo-500/20",
  },
};

export default function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const config = categoryConfig[category] || categoryConfig.vulnerability;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
