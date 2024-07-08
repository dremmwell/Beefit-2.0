import { signOut } from "@/app/actions/auth.actions"
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
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export function LogOut() {
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={signOut}>
            <Button type="submit" variant="default">Log out</Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
