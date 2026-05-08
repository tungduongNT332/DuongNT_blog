import React from "react";
import { ClientPre, ClientAlert } from "./mdx-client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getTextContent).join("");
  if (children && typeof children === "object" && "props" in children) {
    const el = children as React.ReactElement<{ children?: React.ReactNode }>;
    return getTextContent(el.props.children);
  }
  return "";
}

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.id || slugify(getTextContent(props.children));
    return (
      <h2
        id={id}
        className="mt-12 mb-4 scroll-mt-24 text-2xl font-bold text-slate-100 border-b border-slate-800/50 pb-3"
        {...props}
      />
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = props.id || slugify(getTextContent(props.children));
    return (
      <h3
        id={id}
        className="mt-8 mb-3 scroll-mt-24 text-xl font-semibold text-slate-200"
        {...props}
      />
    );
  },
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mt-6 mb-2 scroll-mt-24 text-lg font-semibold text-slate-300"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-slate-300 leading-7" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-violet-400 underline decoration-violet-400/30 underline-offset-2 hover:decoration-violet-400 transition-colors"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-4 ml-6 list-disc space-y-1.5 text-slate-300 marker:text-slate-600" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1.5 text-slate-300 marker:text-slate-500" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-l-4 border-violet-500/30 bg-violet-500/5 py-3 px-4 text-slate-300 italic [&>p]:mb-0"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !props.className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="rounded-md bg-slate-800 px-1.5 py-0.5 text-sm text-violet-300 font-mono"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  pre: ClientPre,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-slate-800/80 text-slate-300" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 text-left font-semibold" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-slate-400 border-t border-slate-800/50" {...props} />
  ),
  hr: () => <hr className="my-8 border-slate-800" />,
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-6 rounded-lg border border-slate-800" alt={props.alt || ""} {...props} />
  ),
  Alert: ClientAlert,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-slate-100" {...props} />
  ),
};
