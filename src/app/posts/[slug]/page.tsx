import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/content";
import { extractToc } from "@/lib/toc";
import { formatDate } from "@/lib/utils";
import { mdxComponents } from "@/components/mdx-components";
import TableOfContents from "@/components/table-of-contents";
import CategoryBadge from "@/components/category-badge";
import { Calendar, ExternalLink, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tocItems = extractToc(post.content);

  const rehypePrettyCodeOptions = {
    theme: "github-dark-default",
    keepBackground: true,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to posts
      </Link>

      {/* Article Header */}
      <header className="mb-10 max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <CategoryBadge category={post.meta.category} />
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.meta.date)}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4 leading-tight">
          {post.meta.title}
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed">
          {post.meta.description}
        </p>

        {/* Tags */}
        {post.meta.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Tag className="h-3.5 w-3.5 text-slate-600" />
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-800/60 px-2 py-0.5 text-xs text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* External Challenge Link */}
        {post.meta.external_link && (
          <a
            href={post.meta.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 px-4 py-2.5 text-sm font-medium text-violet-300 hover:border-violet-500/40 hover:text-violet-200 transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            Open Challenge Link
          </a>
        )}
      </header>

      <hr className="border-slate-800 mb-10" />

      {/* 2-Column Layout */}
      <div className="flex gap-10">
        {/* Table of Contents - Side */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0">
            <TableOfContents items={tocItems} />
          </aside>
        )}

        {/* Mobile TOC */}
        {tocItems.length > 0 && (
          <details className="lg:hidden mb-8 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <summary className="text-sm font-semibold text-slate-300 cursor-pointer">
              📑 Table of Contents
            </summary>
            <ul className="mt-3 space-y-1.5 text-sm">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-slate-500 hover:text-slate-300 transition-colors ${
                      item.level === 3 ? "pl-4" : ""
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}

        {/* Article Content */}
        <article className="min-w-0 flex-1 max-w-none">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode as any, rehypePrettyCodeOptions],
                ],
              },
            }}
          />
        </article>
      </div>
    </div>
  );
}
