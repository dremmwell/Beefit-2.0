import React, { Dispatch, SetStateAction, useState } from 'react';

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
import { Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true)
    try {
      await deleteIngredient(ingredient)
      toast({
        title: `Ingredient "${ingredient.name}" deleted`,
        description: `${ingredient.name} have been removed from the database.`,
    });
      setIsOpen(false)
    }
    catch (error) {
      console.log(error)
    }
    finally {
    setLoading(false)
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