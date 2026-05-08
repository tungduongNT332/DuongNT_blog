import Link from "next/link";
import { FolderGit2, ArrowRight, Calendar } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { getAllProjects } from "@/lib/content";
import CategoryBadge from "@/components/category-badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Showcase of security research projects with documentation and GitHub source code.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
            <FolderGit2 className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100">Projects</h1>
        </div>
        <p className="text-slate-500 max-w-2xl">
          Showcase of security research and development projects. Each project includes
          full documentation and a link to the source code on GitHub.
        </p>
      </div>

      {/* Project Cards (list-style like Kido's Blogs) */}
      {projects.length > 0 ? (
        <div className="space-y-5">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="group flex flex-col sm:flex-row gap-5 rounded-xl border border-slate-800/60 bg-slate-900/50 overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-800/40 hover:shadow-xl hover:shadow-indigo-500/5"
            >
              {/* Thumbnail / Icon Area */}
              <div className="sm:w-56 shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-violet-500/20 p-8 sm:p-0">
                <FolderGit2 className="h-16 w-16 text-indigo-400" />
              </div>

              {/* Content */}
              <div className="flex-1 p-5 sm:py-5 sm:pr-5 sm:pl-0 flex flex-col">
                {/* Badge */}
                <div className="mb-2">
                  <CategoryBadge category="project" />
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Footer: Date + Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(project.date)}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* View Source (GitHub) */}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        View Source
                      </a>
                    )}

                    {/* Read More */}
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all"
                    >
                      Read more
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border border-dashed border-slate-800">
          <FolderGit2 className="h-12 w-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">
            No projects yet. Add <code className="text-violet-400">.mdx</code> files to the{" "}
            <code className="text-violet-400">/content/projects</code> directory to get started.
          </p>
        </div>
      )}
    </div>
  );
}
