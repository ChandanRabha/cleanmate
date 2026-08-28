import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { LanguageProvider } from "./language-context";

export const metadata: Metadata = {
  title: "CleanMate Guwahati | Professional Cleaning Services",
  description: "Professional residential, commercial and industrial housekeeping services across Guwahati, Assam and North East India.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
