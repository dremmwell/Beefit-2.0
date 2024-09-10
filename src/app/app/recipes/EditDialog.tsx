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
import { deleteRecipe } from '@/app/actions/db.actions';
import { Recipe } from '@prisma/client';

export default function EditDialog({
  recipe,
  isOpen,
  setIsOpen
}: {
  recipe: Recipe
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {

  const onDelete = async () => {
    try {
      setIsOpen(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}