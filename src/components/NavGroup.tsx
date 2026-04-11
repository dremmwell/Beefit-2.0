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
        {!isCollapsed &&
            <div
                className='mx-2 mt-2 mb-1 flex cursor-pointer items-center justify-between rounded-md border border-transparent px-2 py-1.5 transition-colors hover:bg-accent/60 hover:text-accent-foreground'
                onClick={() => setIsExpanded((prev) => !prev)}
            >
                <div className='flex items-center gap-2 text-muted-foreground'>
                    {GroupIcon && <GroupIcon className='h-4 w-4' />}
                    <h1 className='text-xs font-medium uppercase tracking-wide'>{title}</h1>
                </div>  
                    <ChevronRight
                    className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-90",
                    )}
                    />
            </div>
        }
            <div className={cn("grid transition-all duration-200", isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden rounded-md border border-transparent">
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