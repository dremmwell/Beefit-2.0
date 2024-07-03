import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container my-10 flex flex-col gap-2">
        <h1 className="scroll-m-20 text-7xl first:mt-0 font-agbalumo font-extrabold text-center">Beefit</h1>
        <div className="flex flex-col gap-3 w-2/3 content-center">
          <Link  className={buttonVariants({ variant: "default" })} href="/login">Log in</Link>
          <Link  className={buttonVariants({ variant: "secondary" })} href="/signup">Sign up</Link>
        </div>
    </main>
  );
}