import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"

interface HomeCardsProps {
  title: string
  text: string
  image: StaticImageData
  footer: string
  link: string
}


function HomeCards({ title, text, image, link, footer }: HomeCardsProps) {
  return (
    <Link
      href={link}
      className={cn(
        "group relative flex lg:flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5",
      )}
    >
      {/* Image container with gradient overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/ to-transparent" />

        <div className="absolute bottom-4 left-5 right-5 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary flex">
          {title}
            <svg
              className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 ml-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        <div className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>

        {/* Subtle arrow indicator */}
        <div className="mt-auto flex items-center gap-1 pt-3 text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          <span>{footer}</span>
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-foreground/5 transition-all duration-300 group-hover:ring-foreground/10" />
    </Link>
  )
}

export default HomeCards
