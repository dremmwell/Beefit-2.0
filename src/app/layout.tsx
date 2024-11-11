import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css";
import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Beefit",
  description: "The beef that keep you fit",
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
    <html lang="en" 
    className={`${GeistSans.variable} ${GeistMono.variable}`}
    suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased flex",
          fontSans.variable
        )}>
          <div className=" flex flex-col sm:flex-row lg:size-11/12 xl:size-10/12 lg:rounded-[0.5rem] lg:border bg-background lg:shadow-md lg:m-auto m-0 max-h-dvh size-full overflow-hidden">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
                {children}
              <Toaster />
            </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
