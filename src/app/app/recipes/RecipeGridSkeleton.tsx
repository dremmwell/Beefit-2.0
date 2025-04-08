import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

function RecipeGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-scroll no-scrollbar">
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
        <Skeleton className= 'w-full h-64 rounded-xl'></Skeleton>
    </div>
  )
}

export default RecipeGridSkeleton
