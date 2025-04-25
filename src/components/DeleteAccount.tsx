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

export function DeleteAccount() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={true}>Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your Account?</AlertDialogTitle>
          <AlertDialogDescription>
          Are you sure you want to delete your account?
          </AlertDialogDescription>
          <AlertDialogDescription>
          This action cannot be undone and will remove all your data from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={signOut}>
            <div className="flex">
              <Button type="submit" variant="default" className="flex-grow">Delete Account</Button>
            </div>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}