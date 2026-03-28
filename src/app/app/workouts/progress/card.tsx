"use client"

import { useState } from "react"
import { Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Card as CardType } from "./board"
import { getContrastColor } from "@/lib/utils"

type CardProps = {
  card: CardType
  labels: any
  onDeleteCard: () => void
}

export default function Card({ card, labels, onDeleteCard }: CardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <>
      <div
        className="bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        <div className="text-sm pr-6">{card.title}</div>

        {(isHovered || (typeof window !== "undefined" && "ontouchstart" in window)) && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary"
              onClick={() => setIsEditDialogOpen(true)}
              title="Edit card"
            >
              <Edit className="h-3 w-3" />
              <span className="sr-only">Edit card</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteCard()
              }}
              title="Delete card"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete card</span>
            </Button>
          </div>
        )}
      </div>

    </>
  )
}
