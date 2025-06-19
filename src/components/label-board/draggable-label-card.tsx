"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteLabelDialog from "./delete-label-dialog"
import type { Label } from "./label-types"
import { cn } from "@/lib/utils"

type DraggableLabelCardProps = {
  label: Label
  groupId: string
  onDeleteLabel: (labelId: string, groupId: string) => void
}

export default function DraggableLabelCard({ label, groupId, onDeleteLabel }: DraggableLabelCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Drag handling
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        labelId: label.id,
        sourceGroupId: groupId,
      }),
    )
    e.dataTransfer.effectAllowed = "move"

    // Add a slight delay to set dragging state for visual feedback
    setTimeout(() => {
      setIsDragging(true)
    }, 0)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <>
      <div
        ref={cardRef}
        className={cn(
          "bg-card border rounded-md p-3 relative group cursor-move transition-all duration-200",
          isHovered && !isDragging ? "shadow-md" : "shadow-sm",
          isDragging ? "opacity-50" : "",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: label.color }} />
          <span className="text-sm font-medium truncate">{label.name}</span>
        </div>

        {isHovered && !isDragging && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              title="Delete label"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete label</span>
            </Button>
          </div>
        )}
      </div>

      <DeleteLabelDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          onDeleteLabel(label.id, groupId)
          setIsDeleteDialogOpen(false)
        }}
        labelName={label.name}
        labelColor={label.color}
      />
    </>
  )
}
