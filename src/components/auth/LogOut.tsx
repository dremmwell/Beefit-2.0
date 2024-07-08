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
import { Form } from "react-hook-form"

export function LogOut() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <form action={signOut}>
          <Button variant="outline" type="submit">Log out</Button>
        </form>
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
          <Link href="/" className={buttonVariants({ variant: "default"})}>Log out</Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
