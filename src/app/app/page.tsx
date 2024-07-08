import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

    return (
      <main className="container my-10 flex flex-col gap-2">
          <h1 className="scroll-m-20 border-b text-3xl font-semibold tracking-tight first:mt-0">Dashboard - {user.username}</h1>
      </main>
    );
  }
  
  