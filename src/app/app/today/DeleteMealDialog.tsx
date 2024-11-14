import React, { Dispatch, SetStateAction, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { deleteMeal } from '@/app/actions/db.actions';
import { Meal } from '@prisma/client';
import { MealValues, TimeLineMeal } from '@/app/types/definitions';
import { Loader2 } from 'lucide-react';

export default function DeleteMealDialog({
  meal,
  isOpen,
  setIsOpen
}: {
  meal: TimeLineMeal;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    setLoading(true)
    try {
      await deleteMeal(meal.mealId)
      toast({
        title: `Meal deleted`,
        description: ` Your new meal have been removed from your diary.`,
      });
      setIsOpen(false)
    }
    catch (error) {
      console.log(error)
    }
    finally
    {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure to delete your meal?
            {meal.description?.split('\n').map((line, index) => (
                <div key={index} className="text-base text-muted-foreground indent-4 mt-2">{line}</div>
            ))}
            </AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your meal and remove it from the database.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel >Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={onDelete}>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Delete
            </AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}