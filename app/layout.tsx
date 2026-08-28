import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { LanguageProvider } from "./language-context";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "CleanMate Guwahati | Professional Cleaning Services",
  description: "Professional residential, commercial and industrial housekeeping services across Guwahati, Assam and North East India.",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
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
