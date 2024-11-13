import React, { Dispatch, SetStateAction } from 'react';
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

export default function DeleteDialog({
  meal,
  isOpen,
  setIsOpen
}: {
  meal: Meal;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

  const { toast } = useToast()

  const onDelete = async () => {
    try {
/*       await deleteMeal(meal.id, meal.userId) */
      toast({
        title: `Meal "${meal.name}" deleted`,
        description: ` ${meal.name} have been removed to the database.`,
      });
      setIsOpen(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure to delete your Meal of {meal.name}?</AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your ingredient and remove it from the database.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel >Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}