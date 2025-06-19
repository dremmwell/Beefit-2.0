"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteLabelDialog from "./delete-label-dialog"
import type { Label } from "./label-types"
import { cn } from "@/lib/utils"

type LabelCardProps = {
  label: Label
  onDeleteLabel: () => void
}

export default function LabelCard({ label, onDeleteLabel }: LabelCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          "bg-card border rounded-md p-3 relative group transition-all duration-200",
          isHovered ? "shadow-md" : "shadow-sm",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center">
          <div className="h-5 w-5 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: label.color }} />
          <span className="text-sm font-medium truncate">{label.name}</span>
        </div>

        {isHovered && (
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
        onConfirm={onDeleteLabel}
        labelName={label.name}
        labelColor={label.color}
      />
    </>
  )
}
