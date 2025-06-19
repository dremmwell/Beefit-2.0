"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import DroppableLabelColumn from "./droppable-label-column"
import { LabelBoardProvider, type LabelGroup } from "./label-board-context"
import { initialLabels as defaultInitialLabels, type Label } from "./label-types"

type LabelBoardProps = {
  onLabelsChange: (allLabels: Label[]) => void
  onGroupsChange?: (groups: LabelGroup[]) => void
  initialLabels?: Label[]
  initialGroups?: LabelGroup[]
}

// Default groups if no initial groups are provided
const DEFAULT_GROUPS = (labels: Label[]): LabelGroup[] => [
  {
    id: "group-1",
    title: "Priority",
    backgroundColor: "#f3f4f6", // Light gray
    labels: labels.filter((l) => l.groupId === "group-1" || ["Side Delts", "Back Lats", "Biceps"].includes(l.name)),
    value: 14, // High priority value
  },
  {
    id: "group-2",
    title: "Moderate",
    backgroundColor: "#f3f4f6", // Light gray
    labels: labels.filter(
      (l) =>
        l.groupId === "group-2" ||
        ["Pecs", "Delts", "Triceps", "Back", "Lats", "Lower Back", "Glutes"].includes(l.name),
    ),
    value: 10, // Medium priority value
  },
  {
    id: "group-3",
    title: "Maintenance",
    backgroundColor: "#f3f4f6", // Light gray
    labels: labels.filter((l) => l.groupId === "group-3" || ["Quads", "Ischios"].includes(l.name)),
    value: 5, // Low priority value
  },
]

export default function LabelBoard({ onLabelsChange, onGroupsChange, initialLabels, initialGroups }: LabelBoardProps) {
  // Initialize labels state here instead of in the parent
  const [labels, setLabels] = useState<Label[]>(() => {
    return initialLabels || defaultInitialLabels
  })

  // Initialize groups with labels directly embedded
  const [groups, setGroups] = useState<LabelGroup[]>(() => {
    return initialGroups || DEFAULT_GROUPS(labels)
  })

  // Update groups when labels change
  useEffect(() => {
    // Skip processing if there are no labels
    if (labels.length === 0) return

    // Create a map of existing labels in groups for quick lookup
    const existingLabelIds = new Set(groups.flatMap((g) => g.labels.map((l:any) => l.id)))

    // Find labels that aren't assigned to any group
    const unassignedLabels = labels.filter((l) => !existingLabelIds.has(l.id))

    // Check if we need to update - either unassigned labels exist or label counts don't match
    const needsUpdate = unassignedLabels.length > 0 || labels.length !== existingLabelIds.size

    if (!needsUpdate) return

    // Create a map of all labels by ID for quick lookup
    const labelMap = new Map(labels.map((l) => [l.id, l]))

    // Create updated groups with the latest label data
    const updatedGroups = groups.map((group) => {
      // Get unique label IDs from this group
      const uniqueLabelIds = new Set(group.labels.map((l :any) => l.id))

      // Update existing labels with latest data and remove duplicates
      const updatedLabels = Array.from(uniqueLabelIds)
        .map((id) => {
          const label = labelMap.get(id)
          // If label exists in the global state, use it; otherwise keep the existing one
          if (label) {
            return { ...label, groupId: label.groupId || group.id }
          }
          // If label doesn't exist in global state, it was deleted
          return null
        })
        .filter(Boolean) as Label[]

      return {
        ...group,
        labels: updatedLabels,
      }
    })

    // Assign unassigned labels to appropriate groups based on name or existing groupId
    unassignedLabels.forEach((label) => {
      let targetGroupId = label.groupId // Use existing groupId if available

      if (!targetGroupId) {
        // Determine group based on label name
        if (["Side Delts", "Back Lats", "Biceps"].includes(label.name)) {
          targetGroupId = "group-1" // Priority
        } else if (["Quads", "Ischios"].includes(label.name)) {
          targetGroupId = "group-3" // Maintenance
        } else {
          targetGroupId = "group-2" // Moderate
        }
      }

      const targetGroupIndex = updatedGroups.findIndex((g) => g.id === targetGroupId)

      if (targetGroupIndex !== -1) {
        // Check if the label already exists in the group to avoid duplicates
        const labelExists = updatedGroups[targetGroupIndex].labels.some((l :any) => l.id === label.id)

        if (!labelExists) {
          // Add the label with the groupId set
          updatedGroups[targetGroupIndex].labels.push({ ...label, groupId: targetGroupId })
        }
      } else {
        // If target group doesn't exist, add to the first group
        const firstGroupIndex = 0
        const labelExists = updatedGroups[firstGroupIndex].labels.some((l :any) => l.id === label.id)

        if (!labelExists) {
          updatedGroups[firstGroupIndex].labels.push({ ...label, groupId: updatedGroups[firstGroupIndex].id })
        }
      }
    })

    // Only update if the groups have actually changed
    const updatedGroupsJson = JSON.stringify(updatedGroups)
    const currentGroupsJson = JSON.stringify(groups)

    if (updatedGroupsJson !== currentGroupsJson) {
      setGroups(updatedGroups)
    }
  }, [labels])

  // Notify parent component when groups change, but only when necessary
  useEffect(() => {
    // Extract all labels from all groups and ensure they have groupId set
    const allLabels = groups.flatMap((group) =>
      group.labels.map((label :any) => ({
        ...label,
        groupId: label.groupId || group.id, // Ensure groupId is set
      })),
    )

    // Only notify parent if the labels have actually changed
    // This prevents infinite update loops
    const labelsJson = JSON.stringify(allLabels)
    const prevLabelsJson = JSON.stringify(labels)

    if (labelsJson !== prevLabelsJson) {
      // Update our internal labels state
      setLabels(allLabels)

      // Notify parent component
      onLabelsChange(allLabels)
    }

    // Notify parent about group changes if callback exists
    if (onGroupsChange) {
      onGroupsChange(groups)
    }
  }, [groups, onLabelsChange, labels, onGroupsChange])

  const handleAddGroup = () => {
    const newGroup: LabelGroup = {
      id: crypto.randomUUID(),
      title: "New Group",
      backgroundColor: "#f3f4f6", // Light gray
      labels: [],
      value: 0, // Default value for new groups
    }
    setGroups([...groups, newGroup])
  }

  const handleDeleteGroup = (groupId: string) => {
    // Move labels from the deleted group to the first available group
    const groupToDelete = groups.find((g) => g.id === groupId)
    if (!groupToDelete) return

    // Find the first group that's not being deleted
    const targetGroup = groups.find((g) => g.id !== groupId)
    if (!targetGroup) return

    const updatedGroups = groups
      .map((g) => {
        if (g.id === targetGroup.id) {
          // Update the groupId of moved labels
          const movedLabels = groupToDelete.labels.map((label :any) => ({
            ...label,
            groupId: targetGroup.id,
          }))

          return {
            ...g,
            labels: [...g.labels, ...movedLabels],
          }
        }
        return g
      })
      .filter((g) => g.id !== groupId)

    setGroups(updatedGroups)
  }

  const handleUpdateGroup = (groupId: string, updates: Partial<LabelGroup>) => {
    setGroups(groups.map((group) => (group.id === groupId ? { ...group, ...updates } : group)))
  }

  const handleSaveLabel = (labelData: Omit<Label, "id">, groupId: string) => {
    // Create the new label with groupId
    const newLabel = {
      ...labelData,
      id: crypto.randomUUID(),
      groupId, // Set the groupId when creating a new label
    }

    // Add the new label to our internal state
    setLabels((prev) => [...prev, newLabel])

    // Add the new label directly to the specified group
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            labels: [...group.labels, newLabel],
          }
        }
        return group
      }),
    )
  }

  const handleDeleteLabel = (labelId: string, groupId: string) => {
    // Remove the label from our internal state
    setLabels((prev) => prev.filter((label) => label.id !== labelId))

    // Remove the label from its group
    setGroups(
      groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            labels: group.labels.filter((label :any) => label.id !== labelId),
          }
        }
        return group
      }),
    )
  }

  return (
    <LabelBoardProvider initialGroups={groups} onGroupsChange={setGroups}>
      <div className="flex-1 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
        <div className="flex flex-nowrap gap-4 pb-4">
          {groups.map((group) => (
            <DroppableLabelColumn
              key={group.id}
              group={group}
              onDeleteGroup={() => handleDeleteGroup(group.id)}
              onUpdateGroup={(updates : any) => handleUpdateGroup(group.id, updates)}
              onDeleteLabel={handleDeleteLabel}
              onSaveLabel={handleSaveLabel}
            />
          ))}

          <Button
            variant="outline"
            className="h-fit p-3 border-dashed w-72 justify-start text-muted-foreground shrink-0"
            onClick={handleAddGroup}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        </div>
      </div>
    </LabelBoardProvider>
  )
}
