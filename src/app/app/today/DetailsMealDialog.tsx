import React, { Dispatch, SetStateAction } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TimeLineMeal	 } from '@/app/types/definitions';

export default function DetailsDialog({
  meal,
  isOpen,
  setIsOpen
}: {
  meal: TimeLineMeal	
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-3">{meal.title}</DialogTitle>
          <DialogDescription className='flex flex-col gap-2 text-foreground'>
            {meal.description?.split('\n').map((line, index) => (
              <span key={index} className="text-sm">{line}</span>
            ))}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center space-x-4 text-sm mb-2">
                  <div>
                    <h1 className="text-lg text-muted-foreground">Calories</h1>
                    <h2 className="text-lg font-semibold text-foreground">{meal.calories.toFixed(1)} cal</h2>
                  </div>
                  <div>
                    <h1 className="text-lg text-muted-foreground">Proteins</h1>
                    <h2 className="text-lg font-semibold text-foreground">{meal.proteins.toFixed(1)} g</h2>
                  </div>
                  <div>
                    <h1 className="text-lg text-muted-foreground">Carbs</h1>
                    <h2 className="text-lg font-semibold text-foreground">{meal.carbs.toFixed(1)} g</h2>
                  </div>
                  <div>
                    <h1 className="text-lg text-muted-foreground">Fats (Saturated)</h1>
                    <h2 className="text-lg font-semibold text-foreground">{meal.fats.toFixed(1)} g ({meal.saturatedFats.toFixed(1)} g)</h2>
                  </div>
                </div>
              </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}