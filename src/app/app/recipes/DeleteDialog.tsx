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
import { deleteRecipe } from '@/app/actions/db.actions';
import { Recipe } from '@prisma/client';

export default function DeleteDialog({
  recipe,
  isOpen,
  setIsOpen
}: {
  recipe: Recipe
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

  const { toast } = useToast()

  const onDelete = async () => {
    try {
      await deleteRecipe(recipe)
      toast({
        title: `Recipe ${recipe.name} deleted`,
        description: ` ${recipe.name} have been removed to the database.`,
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
            <AlertDialogTitle>Are you absolutely sure to delete your recipe of {recipe.name}?</AlertDialogTitle>
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