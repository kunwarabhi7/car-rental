import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ClientWrapper from "@/components/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car Rental App",
  description: "Book your dream car effortlessly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300`}
      >
        <ClientWrapper>
          <Header />
          <main className="min-h-screen">{children}</main>
        </ClientWrapper>
      </body>
    </html>
  );
}
