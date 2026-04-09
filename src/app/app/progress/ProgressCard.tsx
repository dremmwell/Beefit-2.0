import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function ProgressCard() {
  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Progress Card</CardTitle>
        <CardDescription>
          This is a placeholder for the progress card. It will display thworkout progress and stats.
          </CardDescription>    
        </CardHeader>
        <CardContent>
            {/* Progress details and stats will go here */}
        </CardContent>
        <CardFooter>
            {/* Footer content such as buttons or links can go here */}
        </CardFooter>
    </Card>
  )
}

export default ProgressCard
