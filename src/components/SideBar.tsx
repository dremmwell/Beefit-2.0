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
    <>
      <nav className="sm:rounded-l-lg sm:border-r border-b bg-background grid grid-cols-8 grid-rows-2 place-items-center sm:flex sm:flex-col">
        <div className="col-start-2 col-span-6 flex">
          <Logo/>     
        </div>
        <div className="row-start-2 col-span-full">
            <Separator className="hidden sm:block"/>
            <NavBar isCollapsed={isCollapsed}/>
            <Separator className="hidden sm:block"/>
        </div>
        <div className="sm:mt-auto sm:mr-auto ml-auto m-2 col-span-1 col-start-8">
          <ModeToggle />
        </div>
      </nav>
    </>
  )
}

export default SideBar
