"use client"

import { signOut } from "@/app/actions/auth.actions"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export function LogOut() {
  const [isPending, setIsPending] = useState(false)

  async function handleSignOut() {
    setIsPending(true)
    await signOut()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button variant="outline">Log out</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Log out?</AlertDialogTitle>
          <AlertDialogDescription>
          Are you sure you want to log out from your personnal account?
          </AlertDialogDescription>
          <AlertDialogDescription>
          You will be redirected to the login screen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <form action={handleSignOut}>
            <div className="flex">
              <Button type="submit" variant="default" className="flex-grow" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Log out"}
              </Button>
            </div>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}