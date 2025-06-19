"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, X, PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DraggableLabelCard from "./draggable-label-card"
import LabelCreationDialog from "./label-creation-dialog"
import type { Label as LabelType } from "./label-types"
import { useLabelBoard, type LabelGroup } from "./label-board-context"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type DroppableLabelColumnProps = {
  group: LabelGroup
  onDeleteGroup?: () => void
  onUpdateGroup: (updates: Partial<LabelGroup>) => void
  onDeleteLabel: (labelId: string, groupId: string) => void
  onSaveLabel: (label: Omit<LabelType, "id">, groupId: string) => void
}

export default function DroppableLabelColumn({
  group,
  onDeleteGroup,
  onUpdateGroup,
  onDeleteLabel,
  onSaveLabel,
}: DroppableLabelColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(group.title)
  const [groupValue, setGroupValue] = useState(group.value.toString())
  const [isHovered, setIsHovered] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false)
  const { moveLabel } = useLabelBoard()
  const columnRef = useRef<HTMLDivElement>(null)

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      // Parse the value as an integer, default to 0 if invalid
      const parsedValue = Number.parseInt(groupValue, 10)
      // Allow values from 0 to 100
      const value = isNaN(parsedValue) ? 0 : Math.max(0, Math.min(100, parsedValue))

      onUpdateGroup({
        title: editedTitle.trim(),
        value,
      })
    }
    setIsEditingTitle(false)
  }

  const cancelEditing = () => {
    setEditedTitle(group.title)
    setGroupValue(group.value.toString())
    setIsEditingTitle(false)
  }

  // Drop handling
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (!isDragOver) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (columnRef.current && !columnRef.current.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      if (data.labelId && data.sourceGroupId) {
        moveLabel(data.labelId, data.sourceGroupId, group.id)
      }
    } catch (error) {
      console.error("Error parsing drag data:", error)
    }
  }

  const handleSaveLabelInColumn = (label: Omit<LabelType, "id">) => {
    onSaveLabel(label, group.id)
    setIsCreationDialogOpen(false)
  }

  return (
    <Card
      ref={columnRef}
      className={`w-72 shrink-0 group ${isDragOver ? "ring-2 ring-primary ring-inset" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader className="px-4 py-3 space-y-0 flex flex-row items-center justify-between">
        {isEditingTitle ? (
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Edit Group</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={cancelEditing}
                title="Cancel"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cancel</span>
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="column-title" className="text-xs text-foreground">
                  Title
                </Label>
                <Input
                  id="column-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="h-7 py-1 text-sm mt-1 bg-background border-input text-foreground"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="group-value" className="text-xs text-foreground">
                  Priority Value
                </Label>
                <Input
                  id="group-value"
                  type="number"
                  min="0"
                  max="100"
                  value={groupValue}
                  onChange={(e) => setGroupValue(e.target.value)}
                  className="h-7 py-1 text-sm mt-1 bg-background border-input text-foreground"
                />
              </div>

              <Button
                size="sm"
                onClick={handleSaveTitle}
                className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <CardTitle className="text-sm font-medium text-foreground">{group.title}</CardTitle>
              <div
                className={`ml-2 flex items-center justify-center min-w-[1.5rem] h-5 px-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground`}
                title={`Priority value: ${group.value}`}
              >
                {group.value}
              </div>
            </div>

            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                onClick={() => {
                  setEditedTitle(group.title)
                  setGroupValue(group.value.toString())
                  setIsEditingTitle(true)
                }}
                title="Edit group"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit group</span>
              </Button>

              {onDeleteGroup && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
                  onClick={onDeleteGroup}
                  title="Delete group"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete group</span>
                </Button>
              )}
            </div>
          </>
        )}
      </CardHeader>

      <CardContent className="px-3 pt-0 pb-3">
        <div className="space-y-2 mb-3 overflow-y-auto max-h-[500px]">
          {group.labels.map((label) => (
            <DraggableLabelCard key={label.id} label={label} groupId={group.id} onDeleteLabel={onDeleteLabel} />
          ))}
        </div>

        {group.labels.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-2">
            {isDragOver ? "Drop label here" : "No labels in this group"}
          </div>
        )}

        <Button
          variant="ghost"
          className="w-full justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2"
          onClick={() => setIsCreationDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Label
        </Button>

        <LabelCreationDialog
          open={isCreationDialogOpen}
          onOpenChange={setIsCreationDialogOpen}
          onSave={handleSaveLabelInColumn}
        />
      </CardContent>
    </Card>
  )
}
