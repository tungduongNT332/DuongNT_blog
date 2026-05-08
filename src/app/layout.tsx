import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DuongNT_Blog — Web Security Research & CTF Writeups",
    template: "%s | DuongNT_Blog",
  },
  description:
    "A modern pentesting blog covering web vulnerabilities, security tools, CTF writeups, and payload cheatsheets. Built for hackers and security researchers.",
  keywords: [
    "pentesting",
    "web security",
    "CTF writeups",
    "SQL injection",
    "XSS",
    "Burp Suite",
    "vulnerability research",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#0a0f1c]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
