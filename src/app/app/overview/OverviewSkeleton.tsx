import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import LoadingHam from '@/components/loadingHam'

function OverviewSkeleton() {
  return (
    <>
        <LoadingHam />
        <div className='flex flex-col xl:flex-row gap-4 xl:mt-2'>
            <div className='flex flex-col gap-2 xl:w-4/6'>
                <div className='flex gap-2'>
                    <Skeleton className='rounded-xl h-20 w-full'/>
                    <Skeleton className='rounded-xl h-20 w-full'/>
                    <Skeleton className='rounded-xl h-20 w-full'/>
                    <Skeleton className='rounded-xl h-20 w-full'/>
                    <Skeleton className='rounded-xl h-20 w-full'/>
                    <Skeleton className='rounded-xl h-20 w-full'/>
                    <Skeleton className='rounded-xl h-20 w-full'/>
                </div>
                <Skeleton className='w-80 h-4 ml-auto' />
                <Skeleton className='w-full rounded-xl h-64'/>
                <Skeleton className='display hidden xl:block w-full rounded-xl h-64'/>
            </div>
            <div className='flex flex-col gap-4 w-full'>
                <Skeleton className='rounded-xl w-full xl:h-full h-80'/>
                <div className='flex gap-4'>
                    <Skeleton className='rounded-xl w-full h-24'/>   
                    <Skeleton className='rounded-xl w-full h-24'/>
                </div>
            </div>

        </div>
    </>

  )
}

export default OverviewSkeleton
