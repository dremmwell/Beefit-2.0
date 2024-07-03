import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="m-1 self-end">
          <ModeToggle />
      </div>
      <div className="grid lg:grid-cols-2 place-items-center sm:my-auto gap-10">
        <div className="text-center lg:text-start space-y-6 p-5 lg:pl-20">
          <div>
              <h1 className="text-7xl sm:text-8xl xl:text-9xl font-agbalumo font-extrabold">
                  Beefit
              </h1>
              <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                  When counting counts
              </h2>
          </div>
          <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
            Effortlessly monitor your daily caloric intake, adjust your macros, create personalized recipes and track your progress. 
          </p>

          <div className="w-fullspace-y-4 md:space-y-0 md:space-x-4 space-y-4 px-5 sm:px-0">
            <Link  className={`w-full md:w-1/3 ${buttonVariants({variant: "default"})}`} href="/login">Log in</Link>
            <Link  className={`w-full md:w-1/3 ${buttonVariants({variant: "outline"})}`} href="/signup">Sign up</Link>
          </div>
        </div>
      </div>
      <div className="h-10">
      </div>
    </main>
  );
}
