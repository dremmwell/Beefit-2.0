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
  } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface NavBarProps {
  isCollapsed: boolean
}[]

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
      </div>
    )
}






