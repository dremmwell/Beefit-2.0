import React from 'react'
import { Badge } from '../../../components/ui/badge'

interface TimelineItemProps {
  title: string
  calories: string
  description: string
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, calories, description }) => (
    <li className="last:mb-0 mb-2">
      <div className="grid grid-cols-[minmax(60px,20%)_auto_1fr] grid-rows-[20px_auto] gap-3">
      <div className="ml-auto">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className='flex justify-center max-h-5'>
        <Badge>{calories} cal</Badge> 
      </div>
        <div className="col-start-3 row-start-2 mt-1">
          <p className="text-sm font-medium leading-none text-muted-foreground -translate-y-8">{description}</p>
        </div>
         <div className="col-start-2 row-start-2 w-0.5 bg-muted rounded-3xl h-full mx-auto" />
      </div>
    </li>
  )

interface DayTimelineProps {
  items: Array<Omit<TimelineItemProps, 'isLast'>>
}

export default function DayTimeline({ items }: DayTimelineProps) {
  return (
    <ol className='mx-2 my-4'>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          {...item}
        />
      ))}
    </ol>
  )
}