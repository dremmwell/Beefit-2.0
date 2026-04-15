"use client"

import { useState } from 'react'
import React from 'react'
import NavGroup from './NavGroup'
import {
    Beef,
    CookingPot,
    Target,
    CalendarDays,
    Dumbbell,
    Utensils,
    ArrowUpWideNarrow,
    Zap,
    NotebookPen,
    ListOrdered,
    ListPlus,
  } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from '@/lib/utils'
import { buttonVariants } from "@/components/ui/button"
import { usePathname } from 'next/navigation';
import Nav from './ui/nav'

interface NavBarProps {
  isCollapsed: boolean
}[]

function BicepsFlexedIcon({ className }: { className?: string }) {
  return (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}>
      <path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1"/>
      <path d="M15 14a5 5 0 0 0-7.584 2"/>
      <path d="M9.964 6.825C8.019 7.977 9.5 13 8 15"/>
    </svg>
  )
}

function ListChevronsUpDown({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round"
    strokeLinejoin="round" 
    className={className}>
      <path d="M3 5h8"/>
      <path d="M3 12h8"/>
      <path d="M3 19h8"/>
      <path d="m15 8 3-3 3 3"/>
      <path d="m15 16 3 3 3-3"/>
    </svg>
  )
}

function HamIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="100" height="100" viewBox="0 0 24 24" 
      fill="none" 
      stroke='currentColor'
        strokeWidth="1.7" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
    className={className}>
      <path d="M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856"/>
      <path d="M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288"/>
      <path d="M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025"/>
      <path d="m8.5 16.5-1-1"/>
    </svg>
  )
}

export default function NavBar({isCollapsed} : NavBarProps) {
    const pathname = usePathname();

    const sectionLinkClass = (isActive: boolean) =>
      cn(
        "flex w-full items-center justify-center gap-2 rounded-lg border px-2 py-2 text-sm transition-colors",
        isActive
          ? "border-primary/20 bg-primary text-primary-foreground shadow"
          : "hover:bg-accent hover:text-accent-foreground"
      )

    return (
      <>
      {isCollapsed ? 
      <div className='flex items-center justify-center gap-1 rounded-xl border border-border/50 bg-muted/20 p-1'>
        <Nav 
          isCollapsed={isCollapsed}
          links={[
          {
            title: "Today",
            label: "",
            ref: "/app/today",
            icon: Utensils,
            variant: "ghost",
          },
          {
            title: "Overview",
            label: "",
            ref: "/app/overview",
            icon: CalendarDays,
            variant: "ghost",
          },
        ]}/>
        <Nav
          isCollapsed={isCollapsed}
          links={[
          {
            title: "Objectives",
            label: "",
            ref: "/app/objectives",
            icon: Target,
            variant: "ghost",
          },
          {
            title: "Recipes",
            label: "",
            ref: "/app/recipes",
            icon: CookingPot,
            variant: "ghost",
          },
          {
            title: "Ingredients",
            label: "",
            ref: "/app/ingredients",
            icon: Beef,
            variant: "ghost",
          },
        ]}/>
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Progress",
              label: "",
              ref: "/app/progress",
              // @ts-ignore
              icon : ArrowUpWideNarrow,
              variant: "ghost",
            },
            {
                title: "Exercises",
                label: "",
                ref: "/app/exercises",
                icon: Dumbbell,
                variant: "ghost",
              },
            ]} />
            <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Goals",
                label: "",
                ref: "/app/goals",
                // @ts-ignore
                icon: BicepsFlexedIcon,
                variant: "ghost",
              },
            ]} />
      </div>
    :
      <div className='flex flex-1 flex-col gap-2 py-1 sm:flex-none'>
        <div className='space-y-1'>
          <div className='px-2 pt-2'>
            <Link href="/app/nutrition" className={cn(sectionLinkClass(pathname === "/app/nutrition"), "!border-0 justify-start")}>
              <HamIcon className='h-5 w-5'/>
              <h1 className='font-medium'>Nutrition</h1>
            </Link>
          </div>
          <NavGroup 
          title="Diary"
          icon={NotebookPen} 
          isCollapsed={isCollapsed}
          links={[
          {
            title: "Today",
            label: "",
            ref: "/app/today",
            icon: Utensils,
            variant: "ghost",
          },
          {
            title: "Overview",
            label: "",
            ref: "/app/overview",
            icon: CalendarDays,
            variant: "ghost",
          },
        ]}/>
        <NavGroup 
          title="Planning"
          // @ts-ignore
          icon={ListChevronsUpDown}
          isCollapsed={isCollapsed}
          links={[
          {
            title: "Objectives",
            label: "",
            ref: "/app/objectives",
            icon: Target,
            variant: "ghost",
          },
          {
            title: "Recipes",
            label: "",
            ref: "/app/recipes",
            icon: CookingPot,
            variant: "ghost",
          },
          {
            title: "Ingredients",
            label: "",
            ref: "/app/ingredients",
            icon: Beef,
            variant: "ghost",
          },
        ]}/>
    </div>
    <Separator className='my-0.5 hidden sm:block'/>
      <div className='space-y-1'>
          <div className='px-2'>
            <Link href="/app/workout" className={cn(sectionLinkClass(pathname === "/app/workout"), "!border-0 justify-start")}>
              <Zap className='h-5 w-5'/>
              <h1 className='font-medium'>Workout</h1>
            </Link>
          </div>
          <NavGroup 
            title="Tracking" 
            icon={ListPlus}
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Progress",
                label: "",
                ref: "/app/progress",
                // @ts-ignore
                icon : ArrowUpWideNarrow,
                variant: "ghost",
              },
              {
                  title: "Exercises",
                  label: "",
                  ref: "/app/exercises",
                  icon: Dumbbell,
                  variant: "ghost",
                },
            ]} />
              <NavGroup 
              title="Planning"
              icon={ListOrdered}
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Goals",
                  label: "",
                  ref: "/app/goals",
                  // @ts-ignore
                  icon: BicepsFlexedIcon,
                  variant: "ghost",
                },
              ]} />
              </div>
          </div>
          }
      </>
    )
}
