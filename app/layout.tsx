import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import '@rainbow-me/rainbowkit/styles.css';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trust Protocol - Programmable Onchain Trust Primitive",
  description: "Trust protocol is an open-source layer zero for decentralized trust infrastructure",
  openGraph: {
    title: "Trust Protocol",
    description: "Trust protocol is an open-source layer zero for decentralized trust infrastructure",
    images: [
      {
        url: "/trust_hero.svg",
        width: 800,
        height: 533,
        alt: "Trust Protocol",
      },
    ],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: "/trust_hero.svg",
      button: {
        title: "Launch Trust Protocol",
        action: {
          type: "launch_miniapp",
          name: "Trust Protocol",
          splashImageUrl: "/trust_hero.svg",
          splashBackgroundColor: "#cdffd8"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
