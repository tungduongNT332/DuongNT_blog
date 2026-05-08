import { Suspense } from "react";
import { getAllPosts } from "@/lib/content";
import PostsListClient from "@/components/posts-list-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Posts",
  description:
    "Browse all articles on web vulnerabilities, pentesting tools, CTF writeups, and payload cheatsheets.",
};

export default function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const posts = getAllPosts();

  return (
    <Suspense>
      <PostsListClientWrapper posts={posts} searchParams={searchParams} />
    </Suspense>
  );
}

async function PostsListClientWrapper({
  posts,
  searchParams,
}: {
  posts: ReturnType<typeof getAllPosts>;
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  return (
    <PostsListClient
      initialPosts={posts}
      initialCategory={params.category}
    />
  );
}
