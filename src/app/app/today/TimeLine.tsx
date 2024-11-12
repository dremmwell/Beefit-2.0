import React from 'react'
import { Badge } from '../../../components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TimelineItemProps {
  title: string
  calories: number
  description: string
  mealId: string
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, calories, description }) => (
    <li className="last:mb-0 mb-2">
      <div className="grid grid-cols-[minmax(60px,70px)_auto_1fr] grid-rows-[20px_auto] gap-3">
      <div className="ml-auto">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className='flex justify-center max-h-5 w-20'>
        <Badge>{calories} cal</Badge> 
      </div>
        <div className="col-start-3 row-start-2 mt-1">
          {description?.split('\n').map((line, index) => (
            <div key={index} className="text-sm font-medium text-muted-foreground leading-relaxed -translate-y-[36px]">{line}</div>
          ))}
        </div>
         <div className="col-start-2 row-start-2 w-0.5 bg-muted rounded-3xl mx-auto" />
      </div>
    </li>
  )

interface DayTimelineProps {
  items: Array<TimelineItemProps>
}

export default function DayTimeline({ items }: DayTimelineProps) {
  return (
    <>
      <ol className='mx-2 my-4 mt-2'>
        {items.map((item) => (
          <TimelineItem
            key={item.mealId}
            {...item}
          />
        ))}
      </ol>
    </>

  )
}