import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import "./globals.css";
import * as React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased flex sm:p-5",
          fontSans.variable
        )}>
          <div className=" flex 1 flex-col sm:flex-row lg:size-11/12 xl:size-10/12 rounded-[0.5rem] border bg-background shadow-md sm:m-auto m-0 max-h-dvh size-full">
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
      </body>
    </html>
  );
}
