import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoulSync",
  description: "Chat with AI personas modeled on your favorite tech educators.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <SidebarTrigger className="fixed z-10" />
              {children}
            </SidebarInset>
          </SidebarProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}