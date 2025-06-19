"use client"

import { useState } from "react"
import type { Label } from "./label-types"
import { getContrastColor } from "@/lib/utils"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type LabelListProps = {
  labels: Label[]
  onDeleteLabel: (labelId: string) => void
}

export default function LabelList({ labels, onDeleteLabel }: LabelListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredLabelId, setHoveredLabelId] = useState<string | null>(null)

  if (labels.length === 0) {
    return <div className="text-sm text-muted-foreground">No labels created yet</div>
  }

  const visibleLabels = isExpanded ? labels : labels.slice(0, 4)
  const hasMoreLabels = labels.length > 4

  return (
    <div className="space-y-2">
      {visibleLabels.map((label) => (
        <div
          key={label.id}
          className="relative flex items-center rounded-full h-7 px-3 text-xs font-medium truncate group"
          style={{
            backgroundColor: label.color,
            color: getContrastColor(label.color),
          }}
          onMouseEnter={() => setHoveredLabelId(label.id)}
          onMouseLeave={() => setHoveredLabelId(null)}
        >
          <span className="truncate">{label.name}</span>

          {hoveredLabelId === label.id && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 ml-auto absolute right-1 bg-white/20 hover:bg-white/30 text-current"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteLabel(label.id)
              }}
              title="Delete label"
            >
              <Trash2 className="h-3 w-3" />
              <span className="sr-only">Delete label</span>
            </Button>
          )}
        </div>
      ))}

      {hasMoreLabels && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs h-7 mt-1 flex items-center justify-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 mr-1" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 mr-1" />
              Show {labels.length - 4} more
            </>
          )}
        </Button>
      )}
    </div>
  )
}
