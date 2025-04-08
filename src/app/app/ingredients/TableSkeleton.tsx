import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

function TableSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
        <div className='flex mt-4 gap-4'>
            <Skeleton className="h-8 w-96" />
            <Skeleton className="h-10 w-40 ml-auto" />
        </div>
            <Skeleton className="h-80 w-full" />
    </div>
  )
}

export default TableSkeleton
