import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Catálogo Online Atlântica Natural",
  description: "Catálogo Online Atlântica Natural",
  icons: {
    icon: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/favicon.png",
    shortcut: "https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/products/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className={`${nunito.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
