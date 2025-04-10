import React from 'react'

function LoadingHam() {
  return (
    <>
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="hsl(var(--background))" stroke='hsl(var(--muted-foreground))' strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" 
        className="top-1/2 lg:left-1/2 left-40 absolute p-4 animate-spin-loader lucide lucide-ham-icon lucide-ham"><path d="M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856"/><path d="M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288"/><path d="M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025"/><path d="m8.5 16.5-1-1"/></svg>
    </>
  )
}

export default LoadingHam
