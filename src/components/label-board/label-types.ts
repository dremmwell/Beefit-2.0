// Common label type definition
export type Label = {
  id: string
  name: string
  color: string
  groupId?: string // Track which column the label belongs to
}

// Predefined gym muscle group labels
export const initialLabels: Label[] = [
  { id: "label-1", name: "Pecs", color: "#ef4444", groupId: "group-2" }, // Red
  { id: "label-2", name: "Back", color: "#f97316", groupId: "group-2" }, // Orange
  { id: "label-3", name: "Lats", color: "#eab308", groupId: "group-2" }, // Yellow
  { id: "label-4", name: "Triceps", color: "#84cc16", groupId: "group-2" }, // Lime
  { id: "label-5", name: "Delts", color: "#22c55e", groupId: "group-2" }, // Green
  { id: "label-6", name: "Side Delts", color: "#14b8a6", groupId: "group-1" }, // Teal
  { id: "label-7", name: "Biceps", color: "#06b6d4", groupId: "group-1" }, // Cyan
  { id: "label-8", name: "Quads", color: "#3b82f6", groupId: "group-3" }, // Blue
  { id: "label-9", name: "Ischios", color: "#6366f1", groupId: "group-3" }, // Indigo
  { id: "label-10", name: "Glutes", color: "#8b5cf6", groupId: "group-2" }, // Purple
  { id: "label-11", name: "Lower Back", color: "#ec4899", groupId: "group-2" }, // Pink
  { id: "label-12", name: "Back Lats", color: "#f59e0b", groupId: "group-1" }, // Amber
]
