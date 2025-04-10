import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

function LogInLoading() {
  return (
    <div className='m-auto'>
        <Card>
            <CardHeader>
                <CardTitle className='mb-4'>
                <h1 className="text-7xl sm:text-8xl xl:text-9xl font-agbalumo font-extrabold">
                  Beefit
              </h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="m-auto animate-spin-loader lucide lucide-ham-icon lucide-ham"><path d="M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856"/><path d="M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288"/><path d="M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025"/><path d="m8.5 16.5-1-1"/></svg>
            </CardContent>
            <CardFooter>
                <CardTitle className='m-auto'>Preparing your app</CardTitle>
            </CardFooter>
        </Card>
    </div>
  )
}

export default LogInLoading

