import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import LoadingHam from '@/components/loadingHam'

export default function FocusSkeleton() {
  return (
    <>
        <LoadingHam />
        <Skeleton  className="flex flex-col lg:flex-row gap-3 max-h-fit min-h-0 lg:w-3/4 lg:mr-auto">
        </Skeleton>
    </>
  )
}