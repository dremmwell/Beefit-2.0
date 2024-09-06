import React, { Dispatch, SetStateAction } from 'react';

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
import { deleteRecipe } from '@/app/actions/db.actions';

export default function DeleteDialog({
  recipeId,
  recipeName,
  isOpen,
  setIsOpen
}: {
  recipeId: string;
  recipeName: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

  const onDelete = async () => {
    try {
      deleteRecipe(recipeId)
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
            <AlertDialogTitle>Are you absolutely sure to delete your recipe of {recipeName}?</AlertDialogTitle>
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