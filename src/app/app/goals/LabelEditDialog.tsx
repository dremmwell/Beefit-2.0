import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Labels } from "@prisma/client"
import { LABEL_COLORS } from "@/lib/goals_utils"

type LabelDialogSaveInput = {
  name: string
  color: string
  sets: number | null
}

type LabelEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (label: LabelDialogSaveInput) => void
  label: Labels & { sets?: number | null }
}

export default function LabelEditDialog({ open, onOpenChange, onSave, label }: LabelEditDialogProps) {
  const [name, setName] = useState(label.name)
  const [color, setColor] = useState(label.color)
  const [hasCustomSets, setHasCustomSets] = useState(label.sets !== null && label.sets !== undefined)
  const [setsInput, setSetsInput] = useState(label.sets !== null && label.sets !== undefined ? String(label.sets) : "")

  const parsedSets = Number.parseInt(setsInput, 10)
  const isCustomSetsInvalid = hasCustomSets && (setsInput.trim() === "" || Number.isNaN(parsedSets) || parsedSets < 0)

  useEffect(() => {
    setName(label.name)
    setColor(label.color)
    setHasCustomSets(label.sets !== null && label.sets !== undefined)
    setSetsInput(label.sets !== null && label.sets !== undefined ? String(label.sets) : "")
  }, [label])

  const handleSave = () => {
    if (name.trim()) {
      if (hasCustomSets && (Number.isNaN(parsedSets) || parsedSets < 0)) {
        return
      }

      const setsValue = hasCustomSets ? parsedSets : null

      const labelData = {
        name: name.trim(),
        color,
        sets: setsValue,
      }
      onSave(labelData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Label</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label-name">Label Name</Label>
            <Input
              id="label-name"
              placeholder="Enter label name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Label Color</Label>
            <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-2 max-w-md">
              {LABEL_COLORS.map((colorOption) => (
                <div key={colorOption.value} className="flex items-center">
                  <RadioGroupItem value={colorOption.value} id={`color-${colorOption.value}`} className="sr-only" />
                  <Label
                    htmlFor={`color-${colorOption.value}`}
                    className={`h-8 w-8 rounded-full cursor-pointer flex items-center justify-center border-2 ${
                      color === colorOption.value ? "border-black dark:border-white" : "border-transparent"
                    }`}
                    style={{ backgroundColor: colorOption.value }}
                    title={colorOption.name}
                  >
                    <span className="sr-only">{colorOption.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-custom-sets"
                checked={hasCustomSets}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true
                  setHasCustomSets(isChecked)
                  if (!isChecked) {
                    setSetsInput("")
                  }
                }}
              />
              <Label htmlFor="edit-custom-sets" className="cursor-pointer">Custom sets</Label>
            </div>

            {hasCustomSets && (
              <div className="grid gap-2">
                <Label htmlFor="edit-label-sets">Sets</Label>
                <Input
                  id="edit-label-sets"
                  type="number"
                  min={0}
                  step={1}
                  placeholder="Enter sets"
                  value={setsInput}
                  onChange={(e) => setSetsInput(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isCustomSetsInvalid}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}