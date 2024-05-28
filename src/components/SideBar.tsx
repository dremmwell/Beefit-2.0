'use client'

import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { useEffect, useState } from "react";
import React from 'react'
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";

function SideBar() { 

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { height, width } = useWindowDimensions();

  const smWidth = 640;

  useEffect(() => {
    if (typeof width !== 'undefined') {
      if (width < smWidth) {
        setIsCollapsed(true);
      }
      else {
        setIsCollapsed(false);
      }
    }
  }, [width]);

  return (
    <nav className="rounded-l-lg sm:border-r border-b bg-background text-foreground flex sm:flex-col items-center pb-1">
      <Logo isCollapsed={false}/>
      <Separator className="m-1" orientation={isCollapsed ? "vertical" : "horizontal"}/>
      <NavBar isCollapsed={isCollapsed}/>
      <Separator className="m-1" orientation={isCollapsed ? "vertical" : "horizontal"}/>
      <div className="sm:mt-auto m-2">
        <ModeToggle />
      </div>
    </nav> 
  )
}

export default SideBar
