import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async  function Signup() {

  const {user} = await validateRequest()

  if(user) {
    return redirect("/app/today")
  }

    return (
      <main className="container px-2 sm:px-8 my-10 flex flex-col gap-2">
        <div className="flex justify-between">
          <Link href="/" className="text-3xl xl:text-4xl font-agbalumo font-extrabold flex-1 scroll-m-20 border-b first:mt-0">Beefit</Link>
          <ModeToggle />
        </div>
          <div className="flex flex-col sm:rounded-[0.5rem] sm:border bg-background sm:shadow-md p-4 sm:m-auto gap-4">
            <h3  className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
              Create your account
            </h3>
            <Link  className={`m-auto ${buttonVariants({ variant: "link" })}`} href="/login">Already have an account? Log in here.</Link>
            <SignupForm />
          </div>
      </main>
    );
  }
  