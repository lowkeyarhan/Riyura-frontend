import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGate from "@/src/components/layout/AuthGate";
import { ChunkErrorBoundary } from "@/src/components/layout/ChunkErrorBoundary";
import { ChunkErrorHandler } from "@/src/components/layout/ChunkErrorHandler";
import { NotificationProvider } from "@/src/lib/contexts/NotificationContext";
import { BackendHealthProvider } from "@/src/lib/contexts/BackendHealthContext";
import { BackendHealthGate } from "@/src/components/layout/BackendHealthGate";
import Notification from "@/src/components/ui/Notification";
import { ServersDownModal } from "@/src/components/ui/ServersDownModal";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Riyura",
  description: "Stream anything, anywhere, anytime.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChunkErrorHandler />
        <ChunkErrorBoundary>
          <NotificationProvider>
            <BackendHealthProvider>
              <AuthGate>
                <BackendHealthGate>{children}</BackendHealthGate>
              </AuthGate>
              <ServersDownModal />
            </BackendHealthProvider>
            <Notification />
          </NotificationProvider>
        </ChunkErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}
