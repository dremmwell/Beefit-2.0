import React, { useState } from 'react'
import Nav from './ui/nav'
import { ChevronRight, LucideIcon } from "lucide-react"
import { cn } from '@/lib/utils'

interface NavGroupProps {
  title : string
  icon?: LucideIcon
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    ref: string
    icon: LucideIcon
    variant: "default" | "ghost"
  }[]
}

function NavGroup({title, icon, isCollapsed, links} : NavGroupProps) {
    const [isExpanded, setIsExpanded] = useState(true)
  const GroupIcon = icon

    return (
        <>
            <div className='flex justify-between items-center cursor-pointer' onClick={() => setIsExpanded((prev) => !prev)}>
        <div className='m-2 flex items-center gap-2'>
          {GroupIcon && <GroupIcon className='h-4 w-4' />}
          <h1 className='text-sm'>{title}</h1>
        </div>
                <ChevronRight
                className={cn(
                    "mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-90",
                )}
                />
            </div>
          <div className={cn("grid transition-all duration-200", isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
            <div className="overflow-hidden">
                <Nav 
                    isCollapsed={isCollapsed}
                    links={links}
                />
            </div>
          </div>
        </>
    )
}

export default NavGroup


