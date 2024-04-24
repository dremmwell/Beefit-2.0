import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ingredient } from "@/lib/definitions"

interface DetailsButtonProps {
    ingredient: Ingredient
}
   
  export function DetailsButton({ingredient}: DetailsButtonProps) {

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">Details</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>{ingredient.name}</DialogTitle>
          </DialogHeader>
          <div>
            Ingredient details
          </div>
        </DialogContent>
      </Dialog>
    )
  }