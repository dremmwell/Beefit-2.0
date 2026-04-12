'use client'

import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/ModeToggle";
import { useEffect, useState } from "react";
import React from 'react'
import useWindowDimensions from "@/lib/hooks/useWindowDimensions";
import { User } from "@prisma/client";
import { LogOut } from "./auth/LogOut";

function SideBar({user} : {user : User}) { 

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
      <nav className="grid min-w-[150px] grid-cols-8 grid-rows-2 place-items-center border-b border-border/70 bg-muted/20 backdrop-blur-sm sm:flex sm:flex-col sm:border-b-0 sm:border-r lg:rounded-l-xl">
        <div className="col-span-6 col-start-2 flex w-full items-center justify-center border-b border-border/60 py-2 sm:col-span-full sm:border-b sm:px-2 sm:py-3">
          <Logo/>     
        </div>
        <div className="row-start-2 col-span-full w-full overflow-y-auto no-scrollbar sm:px-1">
            <NavBar isCollapsed={isCollapsed}/>
        </div>
        <div className="flex flex-col mt-2 col-start-1 row-start-1 ml-2 mr-auto gap-4 sm:ml-auto sm:mt-auto sm:mb-2 sm:pt-2">
         <LogOut />
        </div>
        <div className="col-span-1 col-start-8 ml-auto mr-2 sm:mr-auto sm:mb-2 sm:mt-0">
          <ModeToggle />
        </div>
      </nav>
    </>
  )
}

export default SideBar
