"use client"

import { useState } from 'react'
import React from 'react'
import Nav  from './ui/nav'
import {
    CalendarPlus,
    Beef,
    CookingPot,
    Target,
    CalendarDays,
    Home,
    Dumbbell,
    ListOrdered
  } from "lucide-react"
import { Separator } from "@/components/ui/separator"


interface NavBarProps {
  isCollapsed: boolean
}[]

function BicepsFlexedIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1"/>
      <path d="M15 14a5 5 0 0 0-7.584 2"/>
      <path d="M9.964 6.825C8.019 7.977 9.5 13 8 15"/>
    </svg>
  )
}

export default function NavBar({isCollapsed} : NavBarProps) {

    return (
      <div className='flex sm:flex-col flex-1 justify-evenly sm:flex-none'>
        <Nav 
            isCollapsed={isCollapsed}
            links={[
/*               {
                title: "Home",
                label: "",
                ref: "/app",
                icon: Home,
                variant: "ghost",
              }, */
              {
                title: "Today",
                label: "",
                ref: "/app/today",
                icon: CalendarPlus,
                variant: "ghost",
              },
            ]} />
            <Separator className='hidden sm:block'/>
            <Nav 
            isCollapsed={isCollapsed}
            links={[
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
            ]} />
            <Separator className='hidden sm:block'/>
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
                title: "Overview",
                label: "",
                ref: "/app/overview",
                icon: CalendarDays,
                variant: "ghost",
              },
            ]} />
            <Separator className='hidden sm:block'/>
            <Nav 
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Workouts",
                label: "",
                ref: "/app/workouts",
                // @ts-ignore
                icon : BicepsFlexedIcon,
                variant: "ghost",
              },
              {
                title: "Exercises",
                label: "",
                ref: "/app/exercises",
                icon: Dumbbell,
                variant: "ghost",
              },
              {
                title: "Focus",
                label: "",
                ref: "/app/focus",
                icon: ListOrdered,
                variant: "ghost",
              },
            ]} />
      </div>
    )
}







