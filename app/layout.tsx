import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { GlowProvider } from "@/components/providers/GlowProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "YallaViral - The #1 UGC & Studio Booking Platform",
  description: "Scale your brand with viral content. Book top creators and premium diverse studios in minutes.",
  metadataBase: new URL("https://yallaviral.com"),
  openGraph: {
    title: "YallaViral - The #1 UGC & Studio Booking Platform",
    description: "Scale your brand with viral content. Book top creators and premium diverse studios in minutes.",
    url: "https://yallaviral.com",
    siteName: "YallaViral",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider messages={messages}>
          <GlowProvider>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors theme="light" />

            </AuthProvider>
          </GlowProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
