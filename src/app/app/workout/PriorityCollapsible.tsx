"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CardItem {
  id: string
  title: string
  description: string
  content: string
}

interface CollapsibleCardBoxProps {
  title: string
  cards: CardItem[]
  defaultOpen?: boolean
}

export default function CollapsibleCardBox({ title, cards, defaultOpen = true }: CollapsibleCardBoxProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className="w-full max-w-2xl min-w-[500px]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between min-h-[60px]">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {cards.map((card) => (
              <Card key={card.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{card.content}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
