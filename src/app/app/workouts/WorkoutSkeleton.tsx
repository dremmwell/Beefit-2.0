import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import LoadingHam from '@/components/loadingHam'

export default function WorkoutSkeleton() {
  return (
    <>
        <LoadingHam />
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-4 pb-4 mt-4">
        <Skeleton className="w-full lg:h-[600px] h-[70px] rounded-md" />
        <Skeleton className="w-full lg:h-[600px] h-[70px] rounded-md" />
        <Skeleton className="w-full lg:h-[600px] h-[70px] rounded-md" />
        <Skeleton className="w-full lg:h-[600px] h-[70px] rounded-md" />
      </div>
    </>
  )
}