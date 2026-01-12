import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button"
import HomeCards from "@/components/home/HomeCards";

const homeCardsData = [
    {
    title: "Today",
    text: "Get an overview of your daily nutrition and fitness stats at a glance.",
    image: "/images/today.jpg",
    link: "/app/today"
  },
  {
    title: "Recipes",
    text: "Browse and manage your collection of delicious recipes tailored to your dietary goals.",
    image: "/images/recipe.jpg",
    link: "/app/recipes"
  },
  {
    title: "Ingredients",
    text: "Explore and organize your ingredients for better meal planning and cooking.",
    image: "/images/ingredient.jpg",
    link: "/app/ingredients"
  },
  {
    title: "Objectives",
    text: "Set and monitor your fitness and nutrition objectives to achieve your health goals.",
    image: "/images/objective.jpg",
    link: "/app/objectives"
  },
  {
    title: "Overview",
    text: "View comprehensive reports and analytics on your progress over time.",
    image: "/images/overview.jpg",
    link: "/app/overview"
  }
];

export default async function Dashboard() {

  const { user } = await validateRequest()

  if(!user) {
    return redirect("/")
  }

  return (
    <main className="container sm:my-10 my-2 flex flex-col gap-2 max-h-fit min-h-0 px-3 sm:px-10">
        <h1 className="border-b text-3xl font-semibold tracking-tight first:mt-0">Welcome {user.username} !</h1>
        <div className="flex">
          <HomeCards cards={homeCardsData} />
        </div>
    </main>
  );
}
