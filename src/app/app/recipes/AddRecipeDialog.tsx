"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { useState } from "react";
  import { Button } from "@/components/ui/button";


export function AddRecipeDialog () {

    const [open, setOpen] = useState(false);
   
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="self-end">New Recipe</Button>
          </DialogTrigger>
            <DialogContent className="overflow-x-auto">
              <DialogHeader>
                <DialogTitle>New Recipe</DialogTitle>
                <DialogDescription>Create a new recipe and add it to your list!</DialogDescription>
              </DialogHeader>
            </DialogContent>
           </Dialog>
    )
}