import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Inter({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Pelayo Méndez — generative portfolio";
const description =
  "A portfolio that builds itself. Ask anything — the page renders the answer.";

export const metadata: Metadata = {
  metadataBase: new URL("https://pelayomendez.dev"),
  title,
  description,
  // Link previews (LinkedIn, X, Slack…) — public/og.png is a 1200×630 capture of the landing.
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Pelayo Méndez",
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pelayo Méndez — a portfolio that builds itself" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
