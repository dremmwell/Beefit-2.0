import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function CardsSkeleton() {
  return (
    <div className='flex flex-col gap-2 w-full'>
        <Skeleton className='h-60 w-full rounded-lg'/>
        <Skeleton className='h-60 w-full rounded-lg'/>
    </div>
  )
}

export default CardsSkeleton
