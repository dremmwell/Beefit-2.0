import React, { Dispatch, SetStateAction } from 'react';

import { Button } from '@/components/ui/button';

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
          <DialogDescription className='flex flex-col gap-4'>
            {meal.description?.split('\n').map((line, index) => (
              <div key={index} className="text-sm">{line}</div>
            ))}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}