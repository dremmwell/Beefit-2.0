"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Pencil, X, PlusCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import LabelCard from "./label-card"
import type { Label as LabelType } from "./label-types"

// Predefined column background colors
const COLUMN_COLORS = [
  { value: "#f3f4f6", name: "Light Gray" },
  { value: "#fee2e2", name: "Light Red" },
  { value: "#fef3c7", name: "Light Yellow" },
  { value: "#d1fae5", name: "Light Green" },
  { value: "#dbeafe", name: "Light Blue" },
  { value: "#e0e7ff", name: "Light Indigo" },
  { value: "#ede9fe", name: "Light Purple" },
  { value: "#fce7f3", name: "Light Pink" },
]

type LabelGroup = {
  id: string
  title: string
  backgroundColor: string
  labelIds: string[]
}

type LabelColumnProps = {
  group: LabelGroup
  labels: LabelType[]
  onDeleteGroup?: () => void
  onUpdateGroup: (updates: Partial<LabelGroup>) => void
  onDeleteLabel: (labelId: string) => void
  onAddLabel: () => void
}

export default function LabelColumn({
  group,
  labels,
  onDeleteGroup,
  onUpdateGroup,
  onDeleteLabel,
  onAddLabel,
}: LabelColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(group.title)
  const [selectedColor, setSelectedColor] = useState(group.backgroundColor)
  const [isHovered, setIsHovered] = useState(false)

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateGroup({
        title: editedTitle.trim(),
        backgroundColor: selectedColor,
      })
    }
    setIsEditingTitle(false)
  }

  const cancelEditing = () => {
    setEditedTitle(group.title)
    setSelectedColor(group.backgroundColor)
    setIsEditingTitle(false)
  }

  return (
    <div
      className="rounded-lg p-3 w-72 shrink-0 flex flex-col h-fit group"
      style={{ backgroundColor: group.backgroundColor }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isEditingTitle ? (
        <div className="mb-3 bg-white dark:bg-gray-950 p-3 rounded-md shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Edit Group</h3>
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
              <Label htmlFor="column-title" className="text-xs">
                Title
              </Label>
              <Input
                id="column-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="h-7 py-1 text-sm mt-1"
                autoFocus
              />
            </div>

            <div>
              <Label className="text-xs">Background Color</Label>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-1 mt-1">
                {COLUMN_COLORS.map((color) => (
                  <div key={color.value} className="flex items-center">
                    <RadioGroupItem value={color.value} id={`color-${color.value}`} className="sr-only" />
                    <Label
                      htmlFor={`color-${color.value}`}
                      className={`h-6 w-6 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                        selectedColor === color.value ? "border-black dark:border-white" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      <span className="sr-only">{color.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Button size="sm" onClick={handleSaveTitle} className="w-full mt-2">
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-3 px-1 flex justify-between items-center">
          <span className="font-medium">{group.title}</span>

          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              onClick={() => {
                setEditedTitle(group.title)
                setSelectedColor(group.backgroundColor)
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
                className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={onDeleteGroup}
                title="Delete group"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete group</span>
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2 mb-3 overflow-y-auto max-h-[500px]">
        {labels.map((label) => (
          <LabelCard key={label.id} label={label} onDeleteLabel={() => onDeleteLabel(label.id)} />
        ))}
      </div>

      {labels.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-2">No labels in this group</div>
      )}

      <Button
        variant="ghost"
        className="w-full justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2"
        onClick={onAddLabel}
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        Add Label
      </Button>
    </div>
  )
}
