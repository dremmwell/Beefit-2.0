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
import IconMenu from '@/components/icon-menu';
import { Trash2, ListCollapse } from 'lucide-react';

export default function DeleteDialog({
  ingredient,
}: {
  ingredient: Ingredient
}) {

  const onDelete = async () => {
    try {
      deleteIngredient(ingredient)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <button
            className="w-full justify-start flex rounded-md p-2"
          >
          <IconMenu
            text="Delete"
            icon={<Trash2 className="h-4 w-4" />}
            />
          </button>
      </AlertDialogTrigger>
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