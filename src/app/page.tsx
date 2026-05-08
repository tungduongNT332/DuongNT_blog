import Link from "next/link";
import { ArrowRight, Shield, Bug, Wrench, Flag, FileCode } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import PostCard from "@/components/post-card";

const features = [
  {
    icon: Bug,
    title: "Web Vulnerabilities",
    description: "In-depth analysis of SQLi, XSS, IDOR, SSRF, and more OWASP Top 10 vulnerabilities.",
    href: "/posts?category=vulnerability",
    color: "from-red-500 to-orange-500",
    iconColor: "text-red-400",
  },
  {
    icon: Wrench,
    title: "Pentest Tools",
    description: "Hands-on guides for Burp Suite, Nmap, Metasploit, and essential security tools.",
    href: "/posts?category=tool",
    color: "from-cyan-500 to-blue-500",
    iconColor: "text-cyan-400",
  },
  {
    icon: Flag,
    title: "CTF Writeups",
    description: "Step-by-step walkthroughs of web CTF challenges and lab exercises.",
    href: "/posts?category=writeup",
    color: "from-amber-500 to-yellow-500",
    iconColor: "text-amber-400",
  },
  {
    icon: FileCode,
    title: "Payload Cheatsheets",
    description: "Quick-reference payload collections for SQL injection, XSS, path traversal, and more.",
    href: "/cheatsheets",
    color: "from-emerald-500 to-teal-500",
    iconColor: "text-emerald-400",
  },
];

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5">
              <Shield className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-medium text-violet-300">
                Security Research & Education
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-slate-100">Learn </span>
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Web Security
              </span>
              <br />
              <span className="text-slate-100">the Right Way</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
              Deep-dive into web vulnerabilities, master pentesting tools, solve CTF challenges,
              and build your payload arsenal — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-0.5"
              >
                Browse Posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative rounded-xl border border-slate-800/60 bg-slate-900/30 p-6 transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/40 hover:-translate-y-0.5"
              >
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} bg-opacity-10`}
                >
                  <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Latest Posts</h2>
            <p className="mt-1 text-sm text-slate-500">
              Recently published articles and writeups
            </p>
          </div>
          <Link
            href="/posts"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl border border-dashed border-slate-800">
            <p className="text-slate-500">
              No posts yet. Add <code className="text-violet-400">.mdx</code> files to the{" "}
              <code className="text-violet-400">/content</code> directory to get started.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
