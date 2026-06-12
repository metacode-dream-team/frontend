import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { ProfileCompletionGate } from "./providers/ProfileCompletionGate";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "MetaCode",
  description: "Your Dev Journey, Visualized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-w-0 overflow-x-hidden antialiased`}
      >
        <AuthProvider>
          <Suspense fallback={null}>
            <ProfileCompletionGate>
              <Header />
              {children}
              <Footer />
            </ProfileCompletionGate>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
