'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import TopBar from '../components/TopBar';
import ProtectedRoute from '@/contexts/ProtectedRoute';
import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <html lang="en" className="size-full min-h-screen dark" suppressHydrationWarning>
      <body className={`${geist.className} min-h-screen w-full cosmic-background overflow-x-hidden`}>
        <Analytics mode="auto" />
        <main className="relative z-[1] w-full min-h-screen">
          <AuthProvider>   
            <ProtectedRoute>
              {!isDashboard && <TopBar />}
              {children}
            </ProtectedRoute>
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
