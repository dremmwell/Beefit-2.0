import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type LabelDialogSaveInput = {
  name: string
  color: string
  sets: number | null
}

const COLORS = [
  { value: "#ef4444", name: "Red" },
  { value: "#f97316", name: "Orange" },
  { value: "#f59e0b", name: "Amber" },
  { value: "#eab308", name: "Yellow" },
  { value: "#84cc16", name: "Lime" },
  { value: "#22c55e", name: "Green" },
  { value: "#10b981", name: "Emerald" },
  { value: "#14b8a6", name: "Teal" },
  { value: "#06b6d4", name: "Cyan" },
  { value: "#0ea5e9", name: "Light Blue" },
  { value: "#3b82f6", name: "Blue" },
  { value: "#6366f1", name: "Indigo" },
  { value: "#8b5cf6", name: "Purple" },
  { value: "#a855f7", name: "Violet" },
  { value: "#d946ef", name: "Fuchsia" },
  { value: "#ec4899", name: "Pink" },
  { value: "#f43f5e", name: "Rose" },
  { value: "#6b7280", name: "Gray" },
]

type LabelCreationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (label: LabelDialogSaveInput) => void
}

export default function LabelCreationDialog({ open, onOpenChange, onSave }: LabelCreationDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(COLORS[0].value)
  const [hasCustomSets, setHasCustomSets] = useState(false)
  const [setsInput, setSetsInput] = useState("")

  const parsedSets = Number.parseInt(setsInput, 10)
  const isCustomSetsInvalid = hasCustomSets && (setsInput.trim() === "" || Number.isNaN(parsedSets) || parsedSets < 0)

  const handleSave = () => {
    if (name.trim()) {
      if (hasCustomSets && (Number.isNaN(parsedSets) || parsedSets < 0)) {
        return
      }

      const setsValue = hasCustomSets ? parsedSets : null

      const label = {
        name: name.trim(),
        color,
        sets: setsValue,
      }
      onSave(label)
      setName("")
      setColor(COLORS[0].value)
      setHasCustomSets(false)
      setSetsInput("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Label</DialogTitle>
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
              {COLORS.map((colorOption) => (
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
                id="custom-sets"
                checked={hasCustomSets}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true
                  setHasCustomSets(isChecked)
                  if (!isChecked) {
                    setSetsInput("")
                  }
                }}
              />
              <Label htmlFor="custom-sets" className="cursor-pointer">Custom sets</Label>
            </div>

            {hasCustomSets && (
              <div className="grid gap-2">
                <Label htmlFor="label-sets">Sets</Label>
                <Input
                  id="label-sets"
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
            Save Label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}