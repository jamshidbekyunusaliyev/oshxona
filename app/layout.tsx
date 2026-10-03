import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tasty | Recipes worth sharing",
    template: "%s | Tasty",
  },
  description:
    "Find your next favorite meal, cook something memorable, and share it with the people you love.",
  manifest: "/manifest.webmanifest",
  icons: {
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f2e8" },
    { media: "(prefers-color-scheme: dark)", color: "#211d18" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <ThemeProvider>
          {children}
          <SiteFooter />
          <MobileNavigation />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
