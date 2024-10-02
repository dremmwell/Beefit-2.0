import React, { Dispatch, SetStateAction } from 'react';

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
import { deleteIngredient } from "../../actions/db.actions" 
import { Ingredient } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

export default function DeleteDialog({
  ingredient,
  isOpen,
  setIsOpen
}: {
  ingredient: Ingredient
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

  const { toast } = useToast()

  const onDelete = async () => {
    try {
      await deleteIngredient(ingredient)
      toast({
        title: `Ingredient ${ingredient.name} deleted`,
        description: `${ingredient.name} have been removed from the database.`,
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
              <AlertDialogTitle>Are you absolutely sure to delete your {ingredient.name}?</AlertDialogTitle>
              <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your ingredient and remove it from the database.
              </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}