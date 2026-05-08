import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  category: "vulnerability" | "tool" | "writeup" | "cheatsheet" | "project";
  tags: string[];
  thumbnail: string;
  external_link?: string;
  github_link?: string;
  slug: string;
}

const contentDir = path.join(process.cwd(), "content");

export function getAllPosts(): PostMeta[] {
  const categories = ["vulnerabilities", "tools", "writeups", "cheatsheets"];
  const posts: PostMeta[] = [];

  for (const cat of categories) {
    const catDir = path.join(contentDir, cat);
    if (!fs.existsSync(catDir)) continue;

    const files = fs.readdirSync(catDir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const filePath = path.join(catDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContent);
      const slug = file.replace(/\.mdx$/, "");

      posts.push({
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        category: data.category || "vulnerability",
        tags: data.tags || [],
        thumbnail: data.thumbnail || "",
        external_link: data.external_link || "",
        github_link: data.github_link || "",
        slug,
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string) {
  const categories = ["vulnerabilities", "tools", "writeups", "cheatsheets", "projects"];

  for (const cat of categories) {
    const filePath = path.join(contentDir, cat, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        meta: {
          title: data.title || "Untitled",
          description: data.description || "",
          date: data.date || new Date().toISOString(),
          category: data.category || "vulnerability",
          tags: data.tags || [],
          thumbnail: data.thumbnail || "",
          external_link: data.external_link || "",
          github_link: data.github_link || "",
          slug,
        } as PostMeta,
        content,
      };
    }
  }

  return null;
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

/** Get all projects from the /content/projects directory */
export function getAllProjects(): PostMeta[] {
  const projectsDir = path.join(contentDir, "projects");
  if (!fs.existsSync(projectsDir)) return [];

  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  const projects: PostMeta[] = [];

  for (const file of files) {
    const filePath = path.join(projectsDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    const slug = file.replace(/\.mdx$/, "");

    projects.push({
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      category: "project",
      tags: data.tags || [],
      thumbnail: data.thumbnail || "",
      external_link: data.external_link || "",
      github_link: data.github_link || "",
      slug,
    });
  }

  return projects.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
