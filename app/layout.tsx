import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Providers } from "@/app/providers";
import "./globals.css";

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WordCatch",
  description: "English listening practice with grammar topics and quiz checkpoints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
