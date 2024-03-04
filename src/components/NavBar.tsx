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
    Home
  } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface NavBarProps {
  isCollapsed: boolean
}[]

export default function NavBar({isCollapsed} : NavBarProps) {

    return (
      <div>
        <Nav 
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Home",
                label: "",
                ref: "/",
                icon: Home,
                variant: "ghost",
              },
              {
                title: "Today",
                label: "",
                ref: "/today",
                icon: CalendarPlus,
                variant: "ghost",
              },
            ]} />
            <Separator />
            <Nav 
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Recipes",
                label: "",
                ref: "/recipes",
                icon: CookingPot,
                variant: "ghost",
              },
              {
                title: "Ingredients",
                label: "",
                ref: "/ingredients",
                icon: Beef,
                variant: "ghost",
              },
            ]} />
            <Separator />
            <Nav 
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Objectives",
                label: "",
                ref: "/objectives",
                icon: Target,
                variant: "ghost",
              },
              {
                title: "Overview",
                label: "",
                ref: "/overview",
                icon: CalendarDays,
                variant: "ghost",
              },
            ]} />
      </div>
    )
}






