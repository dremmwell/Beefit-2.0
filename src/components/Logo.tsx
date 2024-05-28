'use client'
import React, { useState } from 'react'

interface LogoProps {
  isCollapsed: boolean
}[]

export default function Logo( {isCollapsed}: LogoProps) {

  return (
    <div  className="sm:py-2 sm:pr-2 px-3 flex-initial"
/*           style={{ writingMode: isCollapsed? 'vertical-lr' : 'horizontal-tb'}} */
          >
      <h1 className='text-3xl font-agbalumo font-extrabold xl:text-4xl'
/*           style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }} */
        >
        Beefit
      </h1>
    </div>
  )
}
