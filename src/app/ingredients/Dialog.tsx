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
import { IngredientForm } from "./IngredientForm"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"


export function DialogIngredients() {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="self-end mt-4">Add Ingredient</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] overflow-auto">
              <h3 className="text-lg font-medium">Add Ingredient</h3>
              <p className="text-sm text-muted-foreground">Add a new ingredient to your list !</p>
              <Separator /> 
              <IngredientForm />
        </DialogContent>
      </Dialog>
    )
  }