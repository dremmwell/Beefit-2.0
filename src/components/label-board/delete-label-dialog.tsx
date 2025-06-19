"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getContrastColor } from "@/lib/utils"

type DeleteLabelDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  labelName: string
  labelColor: string
}

export default function DeleteLabelDialog({
  open,
  onOpenChange,
  onConfirm,
  labelName,
  labelColor,
}: DeleteLabelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Label</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete the label {labelName}? This will remove it from all cards.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center py-2">
          <div
            className="h-6 px-3 rounded-full flex items-center border border-border/50"
            style={{
              backgroundColor: labelColor,
              color: getContrastColor(labelColor),
            }}
          >
            <span className="text-xs font-medium">{labelName}</span>
          </div>
        </div>

        <DialogFooter className="sm:justify-between bg-background">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-input text-foreground hover:bg-accent"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
