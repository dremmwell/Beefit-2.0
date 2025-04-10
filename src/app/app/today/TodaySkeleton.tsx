import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import LoadingHam from '@/components/loadingHam'

function TodaySkeleton() {
  return (
    <>
        <LoadingHam />
        <div  className="flex flex-col lg:flex-row gap-4 max-h-fit min-h-0 my-4 xl:mx-12">
            <Card className="overflow-scroll no-scrollbar lg:min-w-80 min-h-56 border-none m-0 p-0">
                <CardContent className="flex flex-col pb-2 m-0 p-0">
                    <Skeleton className='lg:h-[626px] h-64' />
                </CardContent>
            </Card>
            <div className='flex flex-col min-h-0 w-full'>
                <div className='flex gap-1 lg:gap-2 mb-4 items-center'>
                    <Skeleton className="h-8 w-80" />
                    <Skeleton className="h-10 w-24 ml-auto" />
                </div>  
                <Skeleton className="lg:h-4/5 h-52 w-full" />
            </div>
        </div>
    </>
  )
}

export default TodaySkeleton
