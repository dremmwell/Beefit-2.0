"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Label } from "./label-types"

// New data structure where groups directly contain their labels
export type LabelGroup = {
  id: string
  title: string
  backgroundColor: string
  labels: Label[]
  value: number // Added integer value property
}

type LabelBoardContextType = {
  groups: LabelGroup[]
  updateGroups: (groups: LabelGroup[]) => void
  moveLabel: (labelId: string, sourceGroupId: string, targetGroupId: string) => void
}

const LabelBoardContext = createContext<LabelBoardContextType | undefined>(undefined)

export function useLabelBoard() {
  const context = useContext(LabelBoardContext)
  if (!context) {
    throw new Error("useLabelBoard must be used within a LabelBoardProvider")
  }
  return context
}

type LabelBoardProviderProps = {
  children: ReactNode
  initialGroups: LabelGroup[]
  onGroupsChange: (groups: LabelGroup[]) => void
}

export function LabelBoardProvider({ children, initialGroups, onGroupsChange }: LabelBoardProviderProps) {
  const [groups, setGroups] = useState<LabelGroup[]>(initialGroups)

  // Update local state when initialGroups changes
  useEffect(() => {
    setGroups(initialGroups)
  }, [initialGroups])

  const updateGroups = (newGroups: LabelGroup[]) => {
    setGroups(newGroups)
    onGroupsChange(newGroups)
  }

  const moveLabel = (labelId: string, sourceGroupId: string, targetGroupId: string) => {
    if (sourceGroupId === targetGroupId) return

    const newGroups = groups.map((group) => {
      if (group.id === sourceGroupId) {
        return {
          ...group,
          labels: group.labels.filter((label) => label.id !== labelId),
        }
      }
      if (group.id === targetGroupId) {
        const labelToMove = groups.find((g) => g.id === sourceGroupId)?.labels.find((label) => label.id === labelId)

        if (labelToMove) {
          // Update the groupId property when moving the label
          const updatedLabel = { ...labelToMove, groupId: targetGroupId }
          return {
            ...group,
            labels: [...group.labels, updatedLabel],
          }
        }
      }
      return group
    })

    updateGroups(newGroups)
  }

  return <LabelBoardContext.Provider value={{ groups, updateGroups, moveLabel }}>{children}</LabelBoardContext.Provider>
}
