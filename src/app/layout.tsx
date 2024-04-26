import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Beefit",
  description: "App to keep you fit",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/images/favicon_lightmode.svg',
        href: '/images/favicon_lightmode.svg',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/images/favicon_darkmode.svg',
        href: '/images/favicon_darkmode.svg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="p-2 items-center justify-center size-full flex">
          <div className="rounded-[0.5rem] border bg-background shadow-md flex size-full lg:size-11/12 xl:size-10/12">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            <SideBar />
            {children}
            <Toaster />
            </ThemeProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
