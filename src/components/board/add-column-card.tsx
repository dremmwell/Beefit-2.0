"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AddColumnCardProps = {
  newColumnTitle: string
  setNewColumnTitle: (title: string) => void
  totalColumns: number
  onAddColumn: (position?: number) => void
  onCancel: () => void
}

export default function AddColumnCard({
  newColumnTitle,
  setNewColumnTitle,
  totalColumns,
  onAddColumn,
  onCancel,
}: AddColumnCardProps) {
  const [selectedPosition, setSelectedPosition] = useState<string>("end")

  const handleAddColumn = () => {
    if (selectedPosition === "end") {
      onAddColumn()
    } else {
      const position = Number.parseInt(selectedPosition, 10)
      onAddColumn(position)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddColumn()
    } else if (e.key === "Escape") {
      onCancel()
    }
  }

  // Generate position options
  const positionOptions = []
  for (let i = 0; i < totalColumns; i++) {
    positionOptions.push({
      value: i.toString(),
      label: `Position ${i + 1}`,
    })
  }
  positionOptions.push({
    value: "end",
    label: `End (Position ${totalColumns + 1})`,
  })

  return (
    <UICard className="w-72 h-fit shrink-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Add New Column</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="column-title" className="text-xs">
            Column Title
          </Label>
          <Input
            id="column-title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter column title..."
            className="h-7 py-1 text-sm"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Position</Label>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="h-7">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positionOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={handleAddColumn} disabled={!newColumnTitle.trim()}>
            Add Column
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </UICard>
  )
}
