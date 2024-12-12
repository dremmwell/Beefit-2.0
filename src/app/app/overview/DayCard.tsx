"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import useWindowDimensions from '@/lib/hooks/useWindowDimensions'

function DayCard({ date, color, isSelected } : { date : Date, color : string, isSelected: boolean | null; }) {

    const { height, width } = useWindowDimensions();
    const [isShorted , setIsShorted] = useState(false)
    const [dotColor, setDotColor] = useState(color)
    
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
    <div className={`rounded-xl border gap-1 bg-card text-card-foreground shadow cursor-pointer flex flex-col items-center p-1 sm:p-2 ${isSelected ? `border-primary` : ''}`}>
        {!isShorted ?
        <>
            <p className='text-sm text-muted-foreground'>{date.toLocaleString("en-GB", { weekday : "short"})}</p>
            <h4 className='scroll-m-20 text-sm font-semibold tracking-tight'>{date.toLocaleString("en-GB", {day : '2-digit'})}</h4>
            <div
            className={`mt-1 rounded-full w-3 h-3 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2),_1px_1px_2px_rgba(255,255,255,0.3)] bg-${dotColor}`}
            >
            </div>
        </>
        :
        <>
            <p className='text-sm text-muted-foreground'>{date.toLocaleString("en-GB", { weekday : "narrow"})}</p>
            <h4 className='scroll-m-20 text-sm font-semibold tracking-tight'>{date.toLocaleString("en-GB", {day : '2-digit'})}</h4>
            <div
            className={`my-1 rounded-full w-2 h-2 shadow-[inset_-1px_-1px_2px_rgba(0,0,0,0.2),_1px_1px_2px_rgba(255,255,255,0.3)] bg-${dotColor}`}
            >
            </div>
        </>
        }
    </div>
  )
}

export default DayCard