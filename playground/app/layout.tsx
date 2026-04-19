import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Generative Semantic UI — Playground",
  description:
    "It's like HTML for AI agents. Type a prompt, pick an adapter, watch your UI compile.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
