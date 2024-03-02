'use client'

import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { useState } from "react";
import React from 'react'

function SideBar() {

    const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <nav className="rounded-l-lg border-r bg-background text-foreground flex flex-col items-center pb-1">
    <Logo isCollapsed={isCollapsed}/>
    <Separator className="m-1"/>
    <NavBar isCollapsed={isCollapsed}/>
    <Separator className="m-1"/>
    <div className="mt-auto">
      <ModeToggle />
    </div>
  </nav> 
  )
}

export default SideBar
