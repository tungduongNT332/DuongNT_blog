"use client";

import { Check, Copy } from "lucide-react";
import { useState, useCallback, useRef } from "react";

function CodeCopyButton({ preRef }: { preRef: React.RefObject<HTMLPreElement | null> }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const code = preRef.current?.textContent || "";
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [preRef]);

  return (
    <button
      onClick={handleCopy}
      className="absolute right-3 top-3 rounded-md bg-slate-700/80 p-1.5 text-slate-400 opacity-0 transition-all hover:bg-slate-600 hover:text-slate-200 group-hover:opacity-100"
      title="Copy code"
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

export function ClientPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <div className="group relative">
      <pre
        ref={ref}
        className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0d1117] p-4 text-sm leading-relaxed my-6"
        {...props}
      >
        {children}
      </pre>
      <CodeCopyButton preRef={ref} />
    </div>
  );
}

export function ClientAlert({
  type = "note",
  children,
}: {
  type?: "note" | "warning" | "tip" | "important" | "caution";
  children: React.ReactNode;
}) {
  const styles: Record<string, { border: string; bg: string; icon: string; title: string }> = {
    note: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/5",
      icon: "💡",
      title: "Note",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      icon: "⚠️",
      title: "Warning",
    },
    tip: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      icon: "✅",
      title: "Tip",
    },
    important: {
      border: "border-violet-500/30",
      bg: "bg-violet-500/5",
      icon: "📌",
      title: "Important",
    },
    caution: {
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      icon: "🔴",
      title: "Caution",
    },
  };

  const style = styles[type] || styles.note;

  return (
    <div
      className={`my-6 rounded-lg border-l-4 ${style.border} ${style.bg} p-4`}
    >
      <p className="mb-1 text-sm font-semibold text-slate-200">
        {style.icon} {style.title}
      </p>
      <div className="text-sm text-slate-400 [&>p]:mb-0">{children}</div>
    </div>
  );
}
