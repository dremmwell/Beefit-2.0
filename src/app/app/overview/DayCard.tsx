"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import useWindowDimensions from '@/lib/hooks/useWindowDimensions'
import { Dot } from '@/components/dot'

function DayCard({ date, dotColor, isSelected } : { date : Date, dotColor : string, isSelected: boolean | null; }) {

    const { height, width } = useWindowDimensions();
    const [isShorted , setIsShorted] = useState(false)
  
   // Get windows dimensions and set isShorted true/false
   const [size ,setSize] = useState(1);
   const shortWidth = 768;
  
   useEffect(() => {
     if (typeof width !== 'undefined') {
       if (width <= shortWidth) {
         setSize(0.7);
         setIsShorted(true)
       }
       else {
        setIsShorted(false)
         setSize(1);
       }
     }
   }, [width]);

  return (
    <div className={`rounded-xl border bg-card text-card-foreground shadow cursor-pointer w-10 md:w-16 flex flex-col items-center p-2 ${isSelected ? `border-${dotColor}` : ''}`}>
        {!isShorted ?
        <>
            <p className='leading-7'>{date.toLocaleString("en-GB", { weekday : "short"})}</p>
            <h4 className='scroll-m-20 text-md font-semibold tracking-tight'>{date.toLocaleString("en-GB", {day : '2-digit'})}</h4>
            <Dot className="mt-1" color={`bg-${dotColor}`} size='md'/>
        </>
        :
        <>
            <p className='leading-7'>{date.toLocaleString("en-GB", { weekday : "narrow"})}</p>
            <h4 className='scroll-m-20 text-md font-semibold tracking-tight'>{date.toLocaleString("en-GB", {day : '2-digit'})}</h4>
            <Dot className="mt-1" color={`bg-${dotColor}`} size='sm'/>
        </>
        }
    </div>
  )
}

export default DayCard