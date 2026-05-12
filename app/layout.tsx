import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased"
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
