import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Check } from 'lucide-react'

type ProgressDetailsRow = {
  id: string
  labelName: string
  labelColor: string
  completedSets: number
  targetSets: number
  progressPercentage: number
}

function ProgressDetails({ rows }: { rows: ProgressDetailsRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">No labels for this group yet.</p>
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.id} className="space-y-2">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.labelColor }} />
              {row.labelName}
              {row.targetSets > 0 && row.completedSets >= row.targetSets && <Check className="h-4 w-4 text-success" />}
            </span>
            <span className="text-muted-foreground">
              {row.completedSets} / {row.targetSets} sets
            </span>
          </div>
          <Progress value={row.progressPercentage} indicatorStyle={{ backgroundColor: row.labelColor }} />
        </div>
      ))}
    </div>
  )
}

export default ProgressDetails
