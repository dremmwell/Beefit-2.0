import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import LoadingHam from '@/components/loadingHam'

export default function FocusSkeleton() {
  return (
    <>
        <LoadingHam />
        <div  className="flex flex-col lg:flex-row gap-3 max-h-fit min-h-0 lg:w-3/4 lg:mr-auto">
            <Skeleton className="h-16 lg:h-96 w-full" />
            <Skeleton className="h-16 lg:h-96 w-full" />
            <Skeleton className="h-16 lg:h-96 w-full" />
        </div>
    </>
  )
}