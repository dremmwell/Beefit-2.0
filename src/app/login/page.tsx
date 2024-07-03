import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Login() {
    return (
      <main className="container my-10 flex flex-col gap-2">
          <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Log in</h1>
          <Link  className={buttonVariants({ variant: "link" })} href="/signup">Not registered yet? Sign up here.</Link>
      </main>
    );
  }
  