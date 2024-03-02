'use client'
import React, { useState } from 'react'

interface LogoProps {
  isCollapsed: boolean
}[]

export default function Logo( {isCollapsed}: LogoProps) {

  return (
    <div  className="py-2 pr-2"
          style={{ writingMode: isCollapsed? 'vertical-lr' : 'horizontal-tb'}}>
      <h1 className='text-3xl font-agbalumo font-extrabold xl:text-4xl'
          style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }}
        >
        Beefit
      </h1>
    </div>
  )
}
