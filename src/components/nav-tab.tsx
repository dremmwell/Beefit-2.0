"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Tab {
  label: string
  href: string
}

interface NavTabsProps {
  tabs: Tab[]
  className?: string
}

export default function NavTabs({ tabs, className }: NavTabsProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-all",
              "hover:text-foreground",
              isActive && [
                "bg-background text-foreground shadow-sm",
                "dark:bg-input/30 dark:border-input dark:text-foreground",
              ]
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
