import React from 'react'
import Link from 'next/link'

export default function Logo() {

  return (
    <div  className="sm:py-2 sm:pr-2 px-3">
      <Link href="/app" className="text-3xl xl:text-4xl font-agbalumo font-extrabold flex-1 scroll-m-20 first:mt-0">
          Beefit
      </Link>
    </div>
  )
}
