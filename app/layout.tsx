import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import ToastProvider from "@/components/ui/ToastProvider";
import { CartProvider } from "@/features/merchandise/CartProvider";

const aeonikPro = localFont({
  src: [
    { path: "../public/fonts/AeonikPro-Light.woff2", weight: "300" },
    { path: "../public/fonts/AeonikPro-Regular.woff2", weight: "400" },
    { path: "../public/fonts/AeonikPro-Medium.woff2", weight: "500" },
    { path: "../public/fonts/AeonikPro-Bold.woff2", weight: "700" },
  ],
  variable: "--font-aeonik-pro",
  display: "swap",
});

const plusJakartaSans = localFont({
  src: [
    { path: "../public/fonts/AeonikPro-Light.woff2", weight: "300" },
    { path: "../public/fonts/AeonikPro-Regular.woff2", weight: "400" },
    { path: "../public/fonts/AeonikPro-Medium.woff2", weight: "500" },
    { path: "../public/fonts/AeonikPro-Bold.woff2", weight: "600" },
    { path: "../public/fonts/AeonikPro-Bold.woff2", weight: "700" },
    { path: "../public/fonts/AeonikPro-Bold.woff2", weight: "800" },
  ],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guestly — Discover & Organise Events",
  description:
    "Discover, attend, and organise unforgettable events across Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${aeonikPro.variable} ${plusJakartaSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
