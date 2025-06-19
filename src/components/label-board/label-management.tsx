"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import LabelCreationDialog from "./label-creation-dialog"
import LabelList from "./label-list"
import DeleteLabelDialog from "./delete-label-dialog"
import type { Label } from "./label-types"

type LabelManagementProps = {
  labels: Label[]
  onSaveLabel: (label: Omit<Label, "id">) => void
  onDeleteLabel: (labelId: string) => void
}

export default function LabelManagement({ labels, onSaveLabel, onDeleteLabel }: LabelManagementProps) {
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [labelIdToDelete, setLabelIdToDelete] = useState<string | null>(null)

  const handleDeleteLabelClick = (labelId: string) => {
    setLabelIdToDelete(labelId)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (labelIdToDelete) {
      onDeleteLabel(labelIdToDelete)
      setLabelIdToDelete(null)
    }
  }

  // Find the label to delete
  const labelToDelete = labelIdToDelete ? labels.find((l) => l.id === labelIdToDelete) : null

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium">Muscle Groups</h2>
        <Button onClick={() => setIsCreationDialogOpen(true)} size="sm" className="h-7 px-2">
          <PlusCircle className="h-3.5 w-3.5 mr-1" />
          <span>Add</span>
        </Button>
      </div>
      <LabelList labels={labels} onDeleteLabel={handleDeleteLabelClick} />
      <LabelCreationDialog
        open={isCreationDialogOpen}
        onOpenChange={setIsCreationDialogOpen}
        onSave={(label) => {
          onSaveLabel(label)
          setIsCreationDialogOpen(false)
        }}
      />
      {labelToDelete && (
        <DeleteLabelDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          labelName={labelToDelete.name}
          labelColor={labelToDelete.color}
        />
      )}
    </div>
  )
}
