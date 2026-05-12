import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Kurs Arduino — TTC Szczecin",
  description:
    "Platforma e-learningowa kursu „Podstawy programowania i budowy robotów z Arduino” dla Technikum Technologii Cyfrowych w Szczecinie (10 dni × 8 h).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ backgroundColor: "#ffffff", colorScheme: "light" }}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#ffffff", color: "#171717" }}
      >
        {children}
      </body>
    </html>
  );
}
