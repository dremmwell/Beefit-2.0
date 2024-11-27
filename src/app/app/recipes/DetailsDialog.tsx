import React, { Dispatch, SetStateAction } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RecipeAndIngredients	 } from '@/app/types/definitions';
import { Separator } from '@radix-ui/react-separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Car } from 'lucide-react';

export default function DetailsDialog({
  recipe,
  isOpen,
  setIsOpen
}: {
  recipe: RecipeAndIngredients	
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-3">{recipe.name}</DialogTitle>
          <DialogDescription className='flex flex-col gap-4'>
          <div className='m-4'>
            {recipe.ingredients.map((ingredient: any) => 
                <div
                key={ingredient.ingredient.id}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary" />
                  <div className="space-y-1">
                    <span className="text-sm font-medium leading-none">
                      {ingredient.unit === "grams" ?
                      <>
                        {ingredient.quantity} grams of {ingredient.ingredient.name}
                      </>
                      :
                      <>
                      {ingredient.quantity} {ingredient.ingredient.unit}(s) of {ingredient.ingredient.name} ({ingredient.quantity*ingredient.ingredient.gramsPerUnit}g)
                      </>
                      }
                    </span>
                  </div>
                </div>
            )}
          </div>
          {recipe.instructions !== "" && 
            <Card>
              <CardContent className='pt-6'>
                <span>{recipe.instructions}</span>
              </CardContent>
            </Card>
          }
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}