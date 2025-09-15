import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import { Noto_Sans_Devanagari } from "next/font/google";
const inter = Inter({ subsets: ['latin'] })

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BanRakshak",
  description: "Digital Forest Rights Management System for transparent and efficient implementation of Forest Rights Act",
  keywords: 'forest rights, FRA, government, India, digital governance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansDevanagari.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
